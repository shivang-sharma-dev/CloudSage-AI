import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.session import SessionListItem, PaginatedSessions
from app.schemas.analysis import AnalyzeResponse
from app.services import analysis_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])


@router.get("", response_model=PaginatedSessions)
async def list_sessions(
    page: int = Query(default=1, ge=1, description="Page number"),
    size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> PaginatedSessions:
    """List all analysis sessions, newest first, paginated."""
    return await analysis_service.list_sessions(db, page=page, size=size)


@router.get("/{session_id}", response_model=AnalyzeResponse)
async def get_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> AnalyzeResponse:
    """Get full session detail including all recommendations and charts data."""
    result = await analysis_service.get_session(db, session_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )
    return result


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a session and all associated messages and recommendations."""
    deleted = await analysis_service.delete_session(db, session_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )
