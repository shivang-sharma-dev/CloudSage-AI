import json
from typing import Any


ANALYSIS_JSON_SCHEMA = """{
  "total_monthly_cost_usd": <number>,
  "optimized_monthly_cost_usd": <number>,
  "total_savings_usd": <number>,
  "savings_percentage": <number 0-100>,
  "cost_breakdown": [
    { "service": "<EC2|RDS|S3|ECS|NAT|ALB>", "monthly_cost": <number>, "percentage": <number> }
  ],
  "recommendations": [
    {
      "id": "rec_001",
      "resource_type": "<string>",
      "resource_name": "<string>",
      "issue": "<string describing the problem>",
      "recommendation": "<string describing the fix>",
      "estimated_savings_usd": <number>,
      "priority": "<high|medium|low>",
      "effort": "<easy|medium|hard>",
      "category": "<rightsizing|reserved|scheduling|architecture|storage>"
    }
  ],
  "health_scores": {
    "overall": <0-100>,
    "cost_efficiency": <0-100>,
    "reliability": <0-100>,
    "security_posture": <0-100>,
    "scalability": <0-100>,
    "commentary": {
      "cost_efficiency": "<1-2 sentence insight>",
      "reliability": "<1-2 sentence insight>",
      "security_posture": "<1-2 sentence insight>",
      "scalability": "<1-2 sentence insight>"
    }
  },
  "risk_flags": [
    { "severity": "<high|medium|low>", "resource": "<name>", "message": "<description>" }
  ]
}"""


def build_system_prompt() -> str:
    """
    System prompt for the Claude analysis call.
    Enforces pure JSON output with no markdown or prose.
    """
    return f"""You are CloudSage, an expert AWS Solutions Architect and FinOps specialist with deep expertise in AWS pricing models, cost optimization strategies, and infrastructure best practices.

Your task is to analyze the provided AWS infrastructure configuration and return a detailed cost optimization analysis.

CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON — no markdown, no code fences, no prose before or after the JSON
2. Do NOT include any explanation outside the JSON structure
3. Use realistic AWS pricing (on-demand pricing for the specified regions)
4. All monetary values must be numbers (not strings), rounded to 2 decimal places
5. All scores must be integers between 0 and 100
6. Every recommendation MUST have a unique id like rec_001, rec_002, etc.
7. Priority must be exactly: "high", "medium", or "low"
8. Effort must be exactly: "easy", "medium", or "hard"
9. Category must be exactly one of: "rightsizing", "reserved", "scheduling", "architecture", "storage"

SCORING GUIDANCE:
- Cost efficiency 0-40: severely over-provisioned, no reserved capacity
- Cost efficiency 41-60: some optimization but major opportunities remain
- Cost efficiency 61-80: reasonably optimized with room for improvement
- Cost efficiency 81-100: well-optimized infrastructure

Apply the same guidance for reliability (single-AZ = low), security (open SGs, no encryption = low), scalability (manual scaling, monolith = low).

Return exactly this JSON structure:
{ANALYSIS_JSON_SCHEMA}"""


def build_analysis_user_prompt(config: dict[str, Any]) -> str:
    """
    Build the user-turn prompt from the infrastructure config.
    """
    config_json = json.dumps(config, indent=2)

    return f"""Please analyze the following AWS infrastructure configuration and return a complete cost optimization analysis as JSON.

INFRASTRUCTURE CONFIGURATION:
```json
{config_json}
```

Analyze each resource carefully:
1. Calculate realistic monthly costs based on current AWS pricing
2. Identify every cost optimization opportunity (rightsizing, reserved instances, scheduling, architecture improvements)
3. Generate specific, actionable recommendations with accurate savings estimates
4. Score the architecture health across all 4 dimensions
5. Flag any significant risks (single point of failure, over-provisioning, lack of redundancy)

Remember: Return ONLY the JSON object, no other text."""


def build_chat_user_prompt(analysis_context: dict[str, Any]) -> str:
    """
    System prompt for follow-up chat messages.
    Includes the full analysis as context.
    """
    analysis_summary = {
        "total_monthly_cost_usd": analysis_context.get("total_monthly_cost_usd"),
        "total_savings_usd": analysis_context.get("total_savings_usd"),
        "savings_percentage": analysis_context.get("savings_percentage"),
        "recommendation_count": len(analysis_context.get("recommendations", [])),
        "health_scores": analysis_context.get("health_scores", {}),
        "recommendations": analysis_context.get("recommendations", []),
        "cost_breakdown": analysis_context.get("cost_breakdown", []),
        "risk_flags": analysis_context.get("risk_flags", []),
    }

    return f"""You are CloudSage, an expert AWS Solutions Architect and FinOps specialist. You previously analyzed an AWS infrastructure configuration and produced the following optimization report.

ANALYSIS CONTEXT:
{json.dumps(analysis_summary, indent=2)}

You are now answering follow-up questions from a Solutions Architect who has reviewed this report. 

Guidelines:
- Be specific and reference actual numbers from the analysis
- When discussing savings, use exact dollar amounts from the recommendations
- Use markdown formatting for better readability (bold for key figures, bullet points for lists)
- Keep responses focused and actionable
- If asked about something not in the analysis, say so clearly and offer to help with what you know
- Do NOT return JSON for chat responses — respond in natural language with markdown"""
