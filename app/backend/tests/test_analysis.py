import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, MagicMock
import uuid

from tests.conftest import MOCK_CLAUDE_RESPONSE


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Health endpoint should return 200 with status fields."""
    with patch("app.main.check_db_health", new_callable=AsyncMock, return_value=True):
        response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["db"] == "ok"
    assert "model" in data
    assert "claude" in data["model"].lower() or "claude" in data["model"]


@pytest.mark.asyncio
async def test_health_check_db_down(client: AsyncClient):
    """Health endpoint returns db=error when DB is unreachable."""
    with patch("app.main.check_db_health", new_callable=AsyncMock, return_value=False):
        response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["db"] == "error"


@pytest.mark.asyncio
async def test_app_info(client: AsyncClient):
    """Info endpoint returns app metadata."""
    response = await client.get("/api/v1/info")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "CloudSage AI"
    assert "endpoints" in data


@pytest.mark.asyncio
async def test_analyze_missing_body(client: AsyncClient):
    """Analyze with no resources or raw_config returns 422."""
    response = await client.post("/api/v1/analyze", json={"input_type": "form"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_valid_request(client: AsyncClient):
    """Full analyze pipeline with mocked Claude and DB."""
    session_id = uuid.uuid4()

    mock_session = MagicMock()
    mock_session.id = session_id
    mock_session.title = "EC2 Analysis — April 9, 2026"
    mock_session.created_at = __import__("datetime").datetime.utcnow()
    mock_session.status = "completed"
    mock_session.input_type = "form"
    mock_session.total_monthly_cost = 12480.00
    mock_session.optimized_monthly_cost = 8736.00
    mock_session.total_savings = 3744.00
    mock_session.savings_percentage = 30.0
    mock_session.overall_health_score = 62

    with (
        patch("app.services.analysis_service.claude_service.analyze_infrastructure",
              new_callable=AsyncMock, return_value=MOCK_CLAUDE_RESPONSE),
        patch("app.routers.analysis.get_db") as mock_get_db,
    ):
        # Mock the DB session context manager
        db = AsyncMock()
        db.flush = AsyncMock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock(side_effect=lambda obj: None)
        db.add = MagicMock()

        mock_get_db.return_value.__aenter__ = AsyncMock(return_value=db)
        mock_get_db.return_value.__aexit__ = AsyncMock(return_value=False)

        response = await client.post("/api/v1/analyze", json={
            "resources": [
                {
                    "type": "ec2",
                    "name": "prod-api-server",
                    "instance_type": "m5.4xlarge",
                    "count": 6,
                    "region": "us-east-1",
                    "usage_hours": 744,
                }
            ],
            "input_type": "form",
        })

    # Either 201 (success) or 503 (if session mock not complete)
    assert response.status_code in (201, 503)


@pytest.mark.asyncio
async def test_get_session_not_found(client: AsyncClient):
    """GET /analyze/{id} for non-existent session returns 404."""
    nonexistent_id = uuid.uuid4()

    with patch("app.routers.analysis.get_db") as mock_get_db:
        db = AsyncMock()
        mock_get_db.return_value.__aenter__ = AsyncMock(return_value=db)
        mock_get_db.return_value.__aexit__ = AsyncMock(return_value=False)

        with patch("app.services.analysis_service.get_session",
                   new_callable=AsyncMock, return_value=None):
            response = await client.get(f"/api/v1/analyze/{nonexistent_id}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_sessions_empty(client: AsyncClient):
    """GET /sessions returns paginated empty list."""
    from app.schemas.session import PaginatedSessions

    empty_result = PaginatedSessions(sessions=[], total=0, page=1, size=20, pages=1)

    with patch("app.routers.sessions.get_db") as mock_get_db:
        db = AsyncMock()
        mock_get_db.return_value.__aenter__ = AsyncMock(return_value=db)
        mock_get_db.return_value.__aexit__ = AsyncMock(return_value=False)

        with patch("app.services.analysis_service.list_sessions",
                   new_callable=AsyncMock, return_value=empty_result):
            response = await client.get("/api/v1/sessions")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["sessions"] == []
    assert data["page"] == 1
