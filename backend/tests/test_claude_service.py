import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch

from app.services.claude_service import analyze_infrastructure
from app.utils.prompt_builder import build_system_prompt, build_analysis_user_prompt, build_chat_user_prompt


VALID_CONFIG = {
    "resources": [
        {"type": "ec2", "name": "web-server", "instance_type": "m5.large", "count": 2, "region": "us-east-1"},
    ]
}

VALID_CLAUDE_JSON = json.dumps({
    "total_monthly_cost_usd": 200.0,
    "optimized_monthly_cost_usd": 140.0,
    "total_savings_usd": 60.0,
    "savings_percentage": 30.0,
    "cost_breakdown": [{"service": "EC2", "monthly_cost": 200.0, "percentage": 100.0}],
    "recommendations": [
        {
            "id": "rec_001",
            "resource_type": "EC2",
            "resource_name": "web-server",
            "issue": "Over-provisioned",
            "recommendation": "Rightsize to t3.medium",
            "estimated_savings_usd": 60.0,
            "priority": "high",
            "effort": "easy",
            "category": "rightsizing",
        }
    ],
    "health_scores": {
        "overall": 75,
        "cost_efficiency": 50,
        "reliability": 80,
        "security_posture": 75,
        "scalability": 70,
        "commentary": {
            "cost_efficiency": "Good",
            "reliability": "Good",
            "security_posture": "Good",
            "scalability": "Good",
        },
    },
    "risk_flags": [],
})


def test_build_system_prompt():
    """System prompt should contain key instructions."""
    prompt = build_system_prompt()
    assert "JSON" in prompt
    assert "CloudSage" in prompt
    assert "no markdown" in prompt.lower() or "valid JSON" in prompt


def test_build_analysis_user_prompt():
    """User prompt should include the config JSON."""
    prompt = build_analysis_user_prompt(VALID_CONFIG)
    assert "ec2" in prompt.lower() or "m5.large" in prompt
    assert "ONLY the JSON" in prompt or "JSON" in prompt


def test_build_chat_user_prompt():
    """Chat system prompt should include analysis context."""
    mock_analysis = {
        "total_monthly_cost_usd": 200.0,
        "total_savings_usd": 60.0,
        "savings_percentage": 30.0,
        "recommendations": [],
        "cost_breakdown": [],
        "health_scores": {},
        "risk_flags": [],
    }
    prompt = build_chat_user_prompt(mock_analysis)
    assert "CloudSage" in prompt
    assert "200.0" in prompt or "savings" in prompt.lower()


@pytest.mark.asyncio
async def test_analyze_infrastructure_success():
    """analyze_infrastructure parses valid Claude response."""
    mock_message = MagicMock()
    mock_message.content = [MagicMock(text=VALID_CLAUDE_JSON)]

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(return_value=mock_message)

    with patch("app.services.claude_service.get_client", return_value=mock_client):
        result = await analyze_infrastructure(VALID_CONFIG)

    assert result.total_monthly_cost_usd == 200.0
    assert result.total_savings_usd == 60.0
    assert len(result.recommendations) == 1
    assert result.recommendations[0].priority == "high"


@pytest.mark.asyncio
async def test_analyze_infrastructure_retry_on_bad_json():
    """analyze_infrastructure retries once on malformed JSON, then raises."""
    mock_message = MagicMock()
    mock_message.content = [MagicMock(text="This is not JSON at all")]

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(return_value=mock_message)

    with patch("app.services.claude_service.get_client", return_value=mock_client):
        with pytest.raises(ValueError, match="malformed JSON"):
            await analyze_infrastructure(VALID_CONFIG)

    # Should have been called twice (initial + 1 retry)
    assert mock_client.messages.create.call_count == 2


@pytest.mark.asyncio
async def test_analyze_infrastructure_strips_markdown_fences():
    """analyze_infrastructure handles Claude wrapping JSON in code fences."""
    json_with_fences = f"```json\n{VALID_CLAUDE_JSON}\n```"

    mock_message = MagicMock()
    mock_message.content = [MagicMock(text=json_with_fences)]

    mock_client = AsyncMock()
    mock_client.messages.create = AsyncMock(return_value=mock_message)

    with patch("app.services.claude_service.get_client", return_value=mock_client):
        result = await analyze_infrastructure(VALID_CONFIG)

    assert result.total_monthly_cost_usd == 200.0
