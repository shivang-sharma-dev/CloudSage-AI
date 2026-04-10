import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.session import AnalysisSession
from app.models.message import ChatMessage
from app.models.recommendation import Recommendation
from app.schemas.analysis import (
    AnalyzeRequest, AnalyzeResponse, ChatResponse, ChatMessageResponse,
    ClaudeAnalysisResponse, BeforeAfterItem, CostBreakdownItem,
    RecommendationItem,
)
from app.schemas.session import SessionListItem, PaginatedSessions
from app.services import claude_service

logger = logging.getLogger(__name__)


def _build_title(req: AnalyzeRequest) -> str:
    """Auto-generate a session title from request data."""
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%B %d, %Y")
    if req.resources:
        types = list({r.type.upper() for r in req.resources})
        type_str = ", ".join(sorted(types)[:3])
        return f"{type_str} Analysis — {date_str}"
    return f"Infrastructure Analysis — {date_str}"


def _build_before_after(analysis: ClaudeAnalysisResponse) -> list[BeforeAfterItem]:
    """Build before/after chart data from cost breakdown + recommendations."""
    # Build savings map per service
    savings_by_service: dict[str, float] = {}
    for rec in analysis.recommendations:
        svc = rec.resource_type.upper()
        savings_by_service[svc] = savings_by_service.get(svc, 0) + rec.estimated_savings_usd

    result = []
    for item in analysis.cost_breakdown:
        svc = item.service.upper()
        savings = savings_by_service.get(svc, 0)
        result.append(BeforeAfterItem(
            service=item.service,
            current=round(item.monthly_cost, 2),
            projected=round(max(0, item.monthly_cost - savings), 2),
        ))
    return result


def _session_to_response(session: AnalysisSession) -> AnalyzeResponse:
    """Convert a persisted session ORM object back to an API response."""
    ai = session.ai_response  # JSONB dict

    # Parse nested structures from stored JSON
    cost_breakdown = [CostBreakdownItem(**item) for item in ai.get("cost_breakdown", [])]
    recommendations_raw = ai.get("recommendations", [])
    recommendations = [RecommendationItem(**r) for r in recommendations_raw]

    analysis = ClaudeAnalysisResponse.model_validate(ai)
    before_after = _build_before_after(analysis)

    return AnalyzeResponse(
        id=session.id,
        title=session.title or "Untitled Analysis",
        created_at=session.created_at,
        status=session.status,
        input_type=session.input_type or "form",
        total_monthly_cost_usd=float(session.total_monthly_cost or 0),
        optimized_monthly_cost_usd=float(session.optimized_monthly_cost or 0),
        total_savings_usd=float(session.total_savings or 0),
        savings_percentage=float(session.savings_percentage or 0),
        cost_breakdown=cost_breakdown,
        before_after=before_after,
        recommendations=recommendations,
        health_scores=analysis.health_scores,
        risk_flags=analysis.risk_flags,
    )


async def create_analysis_session(
    db: AsyncSession,
    request: AnalyzeRequest,
) -> AnalyzeResponse:
    """
    Full pipeline:
    1. Build input config dict
    2. Call Claude
    3. Persist session + recommendations
    4. Return structured response
    """
    # Build config dict for Claude
    if request.resources:
        config = {"resources": [r.model_dump(exclude_none=True) for r in request.resources]}
    else:
        config = request.raw_config or {}

    logger.info(f"Starting analysis for {len(config.get('resources', []))} resources")

    # Call Claude
    analysis = await claude_service.analyze_infrastructure(config)

    # Build before/after chart data
    before_after = _build_before_after(analysis)

    # Persist session
    title = request.title or _build_title(request)
    session = AnalysisSession(
        title=title,
        input_config=config,
        input_type=request.input_type,
        ai_response=analysis.model_dump(),
        total_monthly_cost=analysis.total_monthly_cost_usd,
        optimized_monthly_cost=analysis.optimized_monthly_cost_usd,
        total_savings=analysis.total_savings_usd,
        savings_percentage=analysis.savings_percentage,
        overall_health_score=analysis.health_scores.overall,
        status="completed",
    )
    db.add(session)
    await db.flush()  # Get session.id without committing

    # Persist recommendations (denormalized)
    for rec in analysis.recommendations:
        db_rec = Recommendation(
            session_id=session.id,
            rec_id=rec.id,
            resource_type=rec.resource_type,
            resource_name=rec.resource_name,
            issue=rec.issue,
            recommendation=rec.recommendation,
            estimated_savings_usd=rec.estimated_savings_usd,
            priority=rec.priority,
            effort=rec.effort,
            category=rec.category,
        )
        db.add(db_rec)

    await db.commit()
    await db.refresh(session)

    logger.info(f"Session saved: {session.id} — {len(analysis.recommendations)} recommendations")

    return AnalyzeResponse(
        id=session.id,
        title=session.title,
        created_at=session.created_at,
        status=session.status,
        input_type=session.input_type or "form",
        total_monthly_cost_usd=float(analysis.total_monthly_cost_usd),
        optimized_monthly_cost_usd=float(analysis.optimized_monthly_cost_usd),
        total_savings_usd=float(analysis.total_savings_usd),
        savings_percentage=float(analysis.savings_percentage),
        cost_breakdown=analysis.cost_breakdown,
        before_after=before_after,
        recommendations=analysis.recommendations,
        health_scores=analysis.health_scores,
        risk_flags=analysis.risk_flags,
    )


async def get_session(db: AsyncSession, session_id: uuid.UUID) -> AnalyzeResponse | None:
    """Fetch a session by ID and return as AnalyzeResponse."""
    result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        return None
    return _session_to_response(session)


async def list_sessions(
    db: AsyncSession,
    page: int = 1,
    size: int = 20,
) -> PaginatedSessions:
    """Paginated list of sessions with recommendation counts."""
    offset = (page - 1) * size

    # Total count
    total_result = await db.execute(select(func.count(AnalysisSession.id)))
    total = total_result.scalar_one()

    # Recommendation counts per session subquery
    rec_counts = (
        select(Recommendation.session_id, func.count(Recommendation.id).label("rec_count"))
        .group_by(Recommendation.session_id)
        .subquery()
    )

    # Paginated sessions
    sessions_result = await db.execute(
        select(AnalysisSession, rec_counts.c.rec_count)
        .outerjoin(rec_counts, AnalysisSession.id == rec_counts.c.session_id)
        .order_by(AnalysisSession.created_at.desc())
        .offset(offset)
        .limit(size)
    )

    items = []
    for session, rec_count in sessions_result.all():
        items.append(SessionListItem(
            id=session.id,
            title=session.title,
            created_at=session.created_at,
            status=session.status,
            total_monthly_cost=float(session.total_monthly_cost or 0),
            optimized_monthly_cost=float(session.optimized_monthly_cost or 0),
            total_savings=float(session.total_savings or 0),
            savings_percentage=float(session.savings_percentage or 0),
            overall_health_score=session.overall_health_score,
            recommendation_count=rec_count or 0,
        ))

    return PaginatedSessions(
        sessions=items,
        total=total,
        page=page,
        size=size,
        pages=max(1, -(-total // size)),  # ceiling division
    )


async def delete_session(db: AsyncSession, session_id: uuid.UUID) -> bool:
    """Delete a session and cascade-delete its related records."""
    result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        return False
    await db.delete(session)
    await db.commit()
    logger.info(f"Session deleted: {session_id}")
    return True


async def add_chat_message(
    db: AsyncSession,
    session_id: uuid.UUID,
    role: str,
    content: str,
    token_count: int | None = None,
) -> ChatMessage:
    """Persist a single chat message."""
    msg = ChatMessage(
        session_id=session_id,
        role=role,
        content=content,
        token_count=token_count,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


async def process_chat(
    db: AsyncSession,
    session_id: uuid.UUID,
    message: str,
) -> ChatResponse:
    """
    Full chat pipeline:
    1. Load session context
    2. Load existing chat history
    3. Call Claude
    4. Persist both messages
    5. Return both message records
    """
    # Load session
    session_result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == session_id)
    )
    session = session_result.scalar_one_or_none()
    if not session:
        raise ValueError(f"Session {session_id} not found")

    # Load chat history for this session
    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
    )
    history = history_result.scalars().all()
    chat_history = [{"role": msg.role, "content": msg.content} for msg in history]

    # Call Claude
    ai_response, token_count = await claude_service.chat_followup(
        analysis_context=session.ai_response,
        chat_history=chat_history,
        new_message=message,
    )

    # Persist user message
    user_msg = await add_chat_message(db, session_id, "user", message)

    # Persist assistant message
    assistant_msg = await add_chat_message(db, session_id, "assistant", ai_response, token_count)

    return ChatResponse(
        user_message=ChatMessageResponse.model_validate(user_msg),
        assistant_message=ChatMessageResponse.model_validate(assistant_msg),
    )
