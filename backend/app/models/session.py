import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
        nullable=False,
    )
    title: Mapped[str | None] = mapped_column(String(255))
    input_config: Mapped[dict] = mapped_column(JSONB, nullable=False)
    input_type: Mapped[str | None] = mapped_column(String(50))  # 'form' | 'json'
    ai_response: Mapped[dict] = mapped_column(JSONB, nullable=False)
    total_monthly_cost: Mapped[float | None] = mapped_column(Numeric(12, 2))
    optimized_monthly_cost: Mapped[float | None] = mapped_column(Numeric(12, 2))
    total_savings: Mapped[float | None] = mapped_column(Numeric(12, 2))
    savings_percentage: Mapped[float | None] = mapped_column(Numeric(5, 2))
    overall_health_score: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(50), default="completed", nullable=False)

    # Relationships
    messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )
    recommendations: Mapped[list["Recommendation"]] = relationship(
        "Recommendation",
        back_populates="session",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<AnalysisSession id={self.id} title='{self.title}' status='{self.status}'>"
