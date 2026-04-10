import json
import logging
from typing import Any

import anthropic
from anthropic import APIError, APITimeoutError

from app.config import get_settings
from app.schemas.analysis import ClaudeAnalysisResponse
from app.utils.prompt_builder import build_system_prompt, build_analysis_user_prompt, build_chat_user_prompt

logger = logging.getLogger(__name__)
settings = get_settings()

# Module-level Anthropic client (reused across requests)
_client: anthropic.AsyncAnthropic | None = None


def get_client() -> anthropic.AsyncAnthropic:
    global _client
    if _client is None:
        _client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


async def analyze_infrastructure(config: dict[str, Any]) -> ClaudeAnalysisResponse:
    """
    Send infrastructure config to Claude and return structured analysis.
    Retries once if Claude returns malformed JSON.
    """
    client = get_client()
    system_prompt = build_system_prompt()
    user_prompt = build_analysis_user_prompt(config)

    for attempt in range(2):  # Try up to 2 times
        try:
            logger.info(f"Calling Claude analysis (attempt {attempt + 1})")
            response = await client.messages.create(
                model=settings.claude_model,
                max_tokens=settings.claude_max_tokens,
                temperature=settings.claude_temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ],
            )

            raw_text = response.content[0].text.strip()
            logger.debug(f"Claude raw response length: {len(raw_text)} chars")

            # Strip markdown code fences if present (defensive)
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                raw_text = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])

            parsed = json.loads(raw_text)
            result = ClaudeAnalysisResponse.model_validate(parsed)
            logger.info(f"Claude analysis successful: {len(result.recommendations)} recommendations")
            return result

        except json.JSONDecodeError as e:
            logger.warning(f"Claude returned non-JSON (attempt {attempt + 1}): {e}")
            if attempt == 1:
                raise ValueError(f"Claude returned malformed JSON after 2 attempts: {e}") from e

        except Exception as e:
            logger.error(f"Claude API error (attempt {attempt + 1}): {e}")
            if attempt == 1:
                raise

    # Should never reach here
    raise RuntimeError("Unexpected code path in analyze_infrastructure")


async def chat_followup(
    analysis_context: dict[str, Any],
    chat_history: list[dict[str, str]],
    new_message: str,
) -> tuple[str, int]:
    """
    Send a follow-up chat message with full analysis context.
    Returns (assistant_response_text, token_count).
    """
    client = get_client()
    system_prompt = build_chat_user_prompt(analysis_context)

    # Build messages list: history + new message
    messages = [
        *chat_history,
        {"role": "user", "content": new_message},
    ]

    try:
        logger.info(f"Sending chat follow-up ({len(messages)} messages in history)")
        response = await client.messages.create(
            model=settings.claude_model,
            max_tokens=2048,
            temperature=0.3,
            system=system_prompt,
            messages=messages,
        )

        content = response.content[0].text
        token_count = response.usage.output_tokens
        logger.info(f"Chat response: {token_count} tokens")
        return content, token_count

    except (APIError, APITimeoutError) as e:
        logger.error(f"Claude chat API error: {e}")
        raise ValueError(f"AI service error: {str(e)}") from e
