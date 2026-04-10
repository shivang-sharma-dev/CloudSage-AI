import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse
from app.services import analysis_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/analyze", tags=["analysis"])


@router.post("", response_model=AnalyzeResponse, status_code=status.HTTP_201_CREATED)
async def analyze(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
) -> AnalyzeResponse:
    """
    Submit an AWS infrastructure configuration for AI cost analysis.
    
    - Accepts either form-based resource list or raw JSON config
    - Calls Claude AI for analysis
    - Persists session to database
    - Returns full analysis response
    """
    if not request.resources and not request.raw_config:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Either 'resources' or 'raw_config' must be provided",
        )

    try:
        result = await analysis_service.create_analysis_session(db, request)
        return result
    except ValueError as e:
        logger.error(f"Analysis validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI analysis service temporarily unavailable. Please try again.",
        )


@router.get("/{session_id}", response_model=AnalyzeResponse)
async def get_analysis(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> AnalyzeResponse:
    """Retrieve a previously completed analysis session by ID."""
    result = await analysis_service.get_session(db, session_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found",
        )
    return result


@router.post("/{session_id}/chat", response_model=ChatResponse)
async def chat(
    session_id: uuid.UUID,
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    """
    Send a follow-up question about an analysis session.
    
    Claude has full context of:
    - The original infrastructure config
    - All recommendations and cost data
    - Previous messages in this conversation
    """
    try:
        result = await analysis_service.process_chat(db, session_id, request.message)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Chat failed for session {session_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI chat service temporarily unavailable. Please try again.",
        )
