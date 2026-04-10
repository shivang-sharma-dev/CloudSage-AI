from __future__ import annotations
from pydantic import BaseModel, Field, field_validator
from typing import Literal, Any
from datetime import datetime
import uuid


# ─── Resource Input Models ────────────────────────────────────────────────

class ResourceItem(BaseModel):
    """A single AWS resource to be analyzed."""
    type: str = Field(..., description="ec2|rds|s3|ecs|nat|alb")
    name: str | None = Field(None, description="Resource name/identifier")

    # EC2 / ECS fields
    instance_type: str | None = None
    count: int | None = None
    region: str | None = None
    usage_hours: int | None = None

    # RDS fields
    storage_gb: int | None = None
    multi_az: bool | None = None

    # S3 fields
    requests_k: int | None = None
    transfer_gb: int | None = None
    storage_class: str | None = None

    # ECS fields
    task_count: int | None = None
    cpu: str | None = None
    memory: str | None = None
    compute_type: str | None = None

    # NAT fields
    data_processed_gb: int | None = None

    # ALB fields
    alb_type: str | None = None
    lcus: int | None = None

    model_config = {"extra": "allow"}


class AnalyzeRequest(BaseModel):
    """Request to analyze an AWS infrastructure configuration."""
    resources: list[ResourceItem] | None = None
    raw_config: dict[str, Any] | None = None  # For JSON paste input
    input_type: Literal["form", "json"] = "form"
    title: str | None = None

    @field_validator("resources")
    @classmethod
    def at_least_one_resource(cls, v: list | None) -> list | None:
        if v is not None and len(v) == 0:
            raise ValueError("At least one resource is required")
        return v


class ChatRequest(BaseModel):
    """A follow-up chat message on an existing analysis session."""
    message: str = Field(..., min_length=1, max_length=2000)


# ─── Claude Response Schema ───────────────────────────────────────────────

class CostBreakdownItem(BaseModel):
    service: str
    monthly_cost: float
    percentage: float


class RecommendationItem(BaseModel):
    id: str
    resource_type: str
    resource_name: str
    issue: str
    recommendation: str
    estimated_savings_usd: float
    priority: Literal["high", "medium", "low"]
    effort: Literal["easy", "medium", "hard"]
    category: Literal["rightsizing", "reserved", "scheduling", "architecture", "storage"]


class HealthScoreCommentary(BaseModel):
    cost_efficiency: str = ""
    reliability: str = ""
    security_posture: str = ""
    scalability: str = ""


class HealthScores(BaseModel):
    overall: int = Field(ge=0, le=100)
    cost_efficiency: int = Field(ge=0, le=100)
    reliability: int = Field(ge=0, le=100)
    security_posture: int = Field(ge=0, le=100)
    scalability: int = Field(ge=0, le=100)
    commentary: HealthScoreCommentary = Field(default_factory=HealthScoreCommentary)


class RiskFlag(BaseModel):
    severity: Literal["high", "medium", "low"]
    resource: str
    message: str


class ClaudeAnalysisResponse(BaseModel):
    """The exact JSON structure Claude must return."""
    total_monthly_cost_usd: float
    optimized_monthly_cost_usd: float
    total_savings_usd: float
    savings_percentage: float
    cost_breakdown: list[CostBreakdownItem]
    recommendations: list[RecommendationItem]
    health_scores: HealthScores
    risk_flags: list[RiskFlag] = Field(default_factory=list)


# ─── API Response Models ──────────────────────────────────────────────────

class BeforeAfterItem(BaseModel):
    service: str
    current: float
    projected: float


class AnalyzeResponse(BaseModel):
    """Full analysis response returned to the frontend."""
    id: uuid.UUID
    title: str
    created_at: datetime
    status: str
    input_type: str

    # Financials
    total_monthly_cost_usd: float
    optimized_monthly_cost_usd: float
    total_savings_usd: float
    savings_percentage: float

    # Breakdown
    cost_breakdown: list[CostBreakdownItem]
    before_after: list[BeforeAfterItem]

    # AI results
    recommendations: list[RecommendationItem]
    health_scores: HealthScores
    risk_flags: list[RiskFlag]

    model_config = {"from_attributes": True}


class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    role: str
    content: str
    created_at: datetime
    token_count: int | None = None

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    user_message: ChatMessageResponse
    assistant_message: ChatMessageResponse
