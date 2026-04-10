import uuid
from sqlalchemy import String, Text, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("analysis_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    rec_id: Mapped[str | None] = mapped_column(String(50))        # Claude-assigned: rec_001
    resource_type: Mapped[str | None] = mapped_column(String(100))
    resource_name: Mapped[str | None] = mapped_column(String(255))
    issue: Mapped[str | None] = mapped_column(Text)
    recommendation: Mapped[str | None] = mapped_column(Text)
    estimated_savings_usd: Mapped[float | None] = mapped_column(Numeric(10, 2))
    priority: Mapped[str | None] = mapped_column(String(20), index=True)  # high|medium|low
    effort: Mapped[str | None] = mapped_column(String(20))                # easy|medium|hard
    category: Mapped[str | None] = mapped_column(String(50))

    # Relationship
    session: Mapped["AnalysisSession"] = relationship(
        "AnalysisSession",
        back_populates="recommendations",
    )

    def __repr__(self) -> str:
        return f"<Recommendation id={self.id} priority='{self.priority}' savings={self.estimated_savings_usd}>"
