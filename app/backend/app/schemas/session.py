from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime
import uuid


class SessionListItem(BaseModel):
    """Lightweight session item for the history list."""
    id: uuid.UUID
    title: str | None
    created_at: datetime
    status: str
    total_monthly_cost: float | None = None
    optimized_monthly_cost: float | None = None
    total_savings: float | None = None
    savings_percentage: float | None = None
    overall_health_score: int | None = None
    recommendation_count: int = 0

    model_config = {"from_attributes": True}


class PaginatedSessions(BaseModel):
    sessions: list[SessionListItem]
    total: int
    page: int
    size: int
    pages: int
