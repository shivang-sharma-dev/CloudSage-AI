"""
db_utils.py — Helper functions for common CloudSage AI database queries.

Usage (inside a FastAPI route or service):
    from database.db_utils import get_session_with_stats, get_top_savings_recommendations
"""
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any

from sqlalchemy import select, func, desc, and_, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.session import AnalysisSession
from app.models.message import ChatMessage
from app.models.recommendation import Recommendation


# ─── Session Queries ──────────────────────────────────────────────────────


async def get_session_by_id(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> AnalysisSession | None:
    """Fetch a single session by UUID. Returns None if not found."""
    result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.id == session_id)
    )
    return result.scalar_one_or_none()


async def get_sessions_page(
    db: AsyncSession,
    page: int = 1,
    size: int = 20,
    status: str | None = None,
) -> tuple[list[AnalysisSession], int]:
    """
    Paginated sessions list, newest first.
    Returns (sessions, total_count).
    """
    offset = (page - 1) * size

    # Build base query with optional status filter
    where_clause = []
    if status:
        where_clause.append(AnalysisSession.status == status)

    # Count
    count_q = select(func.count(AnalysisSession.id))
    if where_clause:
        count_q = count_q.where(*where_clause)
    total = (await db.execute(count_q)).scalar_one()

    # Data
    data_q = select(AnalysisSession).order_by(desc(AnalysisSession.created_at)).offset(offset).limit(size)
    if where_clause:
        data_q = data_q.where(*where_clause)
    sessions = (await db.execute(data_q)).scalars().all()

    return list(sessions), total


async def get_sessions_count(db: AsyncSession) -> int:
    """Total number of analysis sessions."""
    result = await db.execute(select(func.count(AnalysisSession.id)))
    return result.scalar_one()


async def get_recent_sessions(
    db: AsyncSession,
    limit: int = 5,
) -> list[AnalysisSession]:
    """Fetch the N most recently created sessions."""
    result = await db.execute(
        select(AnalysisSession)
        .order_by(desc(AnalysisSession.created_at))
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_sessions_this_month(db: AsyncSession) -> int:
    """Count of sessions created in the current calendar month."""
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(func.count(AnalysisSession.id)).where(
            AnalysisSession.created_at >= month_start
        )
    )
    return result.scalar_one()


async def search_sessions(
    db: AsyncSession,
    query: str,
    limit: int = 20,
) -> list[AnalysisSession]:
    """
    Full-text search over session titles using ILIKE.
    For production, consider a GIN index + to_tsvector.
    """
    result = await db.execute(
        select(AnalysisSession)
        .where(AnalysisSession.title.ilike(f"%{query}%"))
        .order_by(desc(AnalysisSession.created_at))
        .limit(limit)
    )
    return list(result.scalars().all())


# ─── Aggregate / Stats Queries ────────────────────────────────────────────


async def get_total_savings_identified(db: AsyncSession) -> float:
    """Sum of total_savings across all completed sessions."""
    result = await db.execute(
        select(func.sum(AnalysisSession.total_savings)).where(
            AnalysisSession.status == "completed"
        )
    )
    return float(result.scalar_one() or 0)


async def get_avg_health_score(db: AsyncSession) -> float | None:
    """Average overall health score across all sessions."""
    result = await db.execute(
        select(func.avg(AnalysisSession.overall_health_score)).where(
            AnalysisSession.overall_health_score.is_not(None)
        )
    )
    val = result.scalar_one()
    return round(float(val), 1) if val is not None else None


async def get_dashboard_stats(db: AsyncSession) -> dict[str, Any]:
    """
    Aggregated stats for an admin dashboard or app header.
    Returns total sessions, total savings, avg health, and sessions this month.
    """
    total_sessions = await get_sessions_count(db)
    total_savings = await get_total_savings_identified(db)
    avg_health = await get_avg_health_score(db)
    this_month = await get_sessions_this_month(db)

    return {
        "total_sessions": total_sessions,
        "total_savings_identified_usd": total_savings,
        "avg_health_score": avg_health,
        "sessions_this_month": this_month,
    }


# ─── Recommendation Queries ───────────────────────────────────────────────


async def get_recommendations_for_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    priority: str | None = None,
    effort: str | None = None,
    category: str | None = None,
) -> list[Recommendation]:
    """
    Fetch recommendations for a session with optional filters.
    Sorted by: high priority first, then by savings descending.
    """
    PRIORITY_CASE = text(
        "CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END"
    )

    q = select(Recommendation).where(Recommendation.session_id == session_id)

    if priority:
        q = q.where(Recommendation.priority == priority)
    if effort:
        q = q.where(Recommendation.effort == effort)
    if category:
        q = q.where(Recommendation.category == category)

    q = q.order_by(PRIORITY_CASE, desc(Recommendation.estimated_savings_usd))
    result = await db.execute(q)
    return list(result.scalars().all())


async def get_top_savings_recommendations(
    db: AsyncSession,
    limit: int = 10,
    priority: str | None = "high",
) -> list[Recommendation]:
    """
    Fetch the highest-savings recommendations across ALL sessions.
    Useful for an insights feed or summary view.
    """
    q = (
        select(Recommendation)
        .order_by(desc(Recommendation.estimated_savings_usd))
        .limit(limit)
    )
    if priority:
        q = q.where(Recommendation.priority == priority)
    result = await db.execute(q)
    return list(result.scalars().all())


async def get_recommendation_count_for_session(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> dict[str, int]:
    """
    Returns counts by priority for a given session.
    e.g. {"high": 3, "medium": 2, "low": 1, "total": 6}
    """
    result = await db.execute(
        select(Recommendation.priority, func.count(Recommendation.id).label("n"))
        .where(Recommendation.session_id == session_id)
        .group_by(Recommendation.priority)
    )
    rows = result.all()
    counts: dict[str, int] = {"high": 0, "medium": 0, "low": 0}
    for row in rows:
        if row.priority in counts:
            counts[row.priority] = row.n
    counts["total"] = sum(counts.values())
    return counts


async def get_total_savings_for_session(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> float:
    """Sum of estimated_savings_usd across all recommendations for a session."""
    result = await db.execute(
        select(func.sum(Recommendation.estimated_savings_usd)).where(
            Recommendation.session_id == session_id
        )
    )
    return float(result.scalar_one() or 0)


async def get_savings_by_category(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> list[dict[str, Any]]:
    """
    Aggregated savings per category for a session.
    Returns list of {"category": "rightsizing", "total_savings": 1500.0, "count": 3}
    """
    result = await db.execute(
        select(
            Recommendation.category,
            func.sum(Recommendation.estimated_savings_usd).label("total_savings"),
            func.count(Recommendation.id).label("count"),
        )
        .where(Recommendation.session_id == session_id)
        .group_by(Recommendation.category)
        .order_by(desc("total_savings"))
    )
    return [
        {
            "category": row.category,
            "total_savings": float(row.total_savings or 0),
            "count": row.count,
        }
        for row in result.all()
    ]


# ─── Chat Message Queries ─────────────────────────────────────────────────


async def get_chat_messages(
    db: AsyncSession,
    session_id: uuid.UUID,
    limit: int | None = None,
) -> list[ChatMessage]:
    """Fetch all chat messages for a session, ordered by created_at ASC."""
    q = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
    )
    if limit:
        q = q.limit(limit)
    result = await db.execute(q)
    return list(result.scalars().all())


async def get_chat_message_count(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> int:
    """Number of chat messages (user + assistant) for a session."""
    result = await db.execute(
        select(func.count(ChatMessage.id)).where(ChatMessage.session_id == session_id)
    )
    return result.scalar_one()


async def get_chat_history_for_claude(
    db: AsyncSession,
    session_id: uuid.UUID,
    max_messages: int = 20,
) -> list[dict[str, str]]:
    """
    Returns the most recent N messages formatted for the Anthropic messages API.
    [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
    Always returns an even number (user/assistant pairs) to maintain valid conversation.
    """
    messages = await get_chat_messages(db, session_id, limit=max_messages)
    # Ensure we have valid assistant/user alternating pairs
    history = [{"role": msg.role, "content": msg.content} for msg in messages]
    # Trim leading assistant messages (Claude API requires user first)
    while history and history[0]["role"] == "assistant":
        history = history[1:]
    return history


async def delete_chat_history(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> int:
    """Delete all chat messages for a session. Returns count deleted."""
    result = await db.execute(
        select(ChatMessage).where(ChatMessage.session_id == session_id)
    )
    messages = result.scalars().all()
    count = len(messages)
    for msg in messages:
        await db.delete(msg)
    await db.commit()
    return count


# ─── Bulk / Maintenance Queries ───────────────────────────────────────────


async def delete_sessions_older_than(
    db: AsyncSession,
    days: int,
) -> int:
    """
    Delete sessions older than `days` days.
    Useful for data retention policies.
    Returns count of deleted sessions.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    result = await db.execute(
        select(AnalysisSession).where(AnalysisSession.created_at < cutoff)
    )
    sessions = result.scalars().all()
    count = len(sessions)
    for s in sessions:
        await db.delete(s)
    await db.commit()
    return count


async def get_db_table_sizes(db: AsyncSession) -> list[dict[str, Any]]:
    """
    Returns estimated row counts and disk sizes for all CloudSage tables.
    Useful for admin monitoring.
    """
    query = text("""
        SELECT
            relname AS table_name,
            n_live_tup AS estimated_rows,
            pg_size_pretty(pg_total_relation_size(relid)) AS total_size
        FROM pg_stat_user_tables
        WHERE relname IN ('analysis_sessions', 'chat_messages', 'recommendations')
        ORDER BY pg_total_relation_size(relid) DESC;
    """)
    result = await db.execute(query)
    return [
        {
            "table": row.table_name,
            "estimated_rows": row.estimated_rows,
            "total_size": row.total_size,
        }
        for row in result.all()
    ]
