import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch

from app.main import app
from app.schemas.analysis import ClaudeAnalysisResponse


# ─── Mock Claude response ──────────────────────────────────────────────────
MOCK_CLAUDE_RESPONSE = ClaudeAnalysisResponse(
    total_monthly_cost_usd=12480.00,
    optimized_monthly_cost_usd=8736.00,
    total_savings_usd=3744.00,
    savings_percentage=30.0,
    cost_breakdown=[
        {"service": "EC2", "monthly_cost": 8300.00, "percentage": 66.5},
        {"service": "RDS", "monthly_cost": 2800.00, "percentage": 22.4},
        {"service": "S3", "monthly_cost": 980.00, "percentage": 7.9},
        {"service": "NAT", "monthly_cost": 400.00, "percentage": 3.2},
    ],
    recommendations=[
        {
            "id": "rec_001",
            "resource_type": "EC2",
            "resource_name": "prod-api-server",
            "issue": "6x m5.4xlarge instances running at <20% CPU utilization",
            "recommendation": "Rightsize to m5.xlarge and add auto-scaling",
            "estimated_savings_usd": 2400.00,
            "priority": "high",
            "effort": "medium",
            "category": "rightsizing",
        },
        {
            "id": "rec_002",
            "resource_type": "RDS",
            "resource_name": "prod-postgres-db",
            "issue": "No Multi-AZ configured — single point of failure",
            "recommendation": "Enable Multi-AZ or use Aurora Serverless v2",
            "estimated_savings_usd": 840.00,
            "priority": "medium",
            "effort": "easy",
            "category": "architecture",
        },
    ],
    health_scores={
        "overall": 62,
        "cost_efficiency": 45,
        "reliability": 70,
        "security_posture": 78,
        "scalability": 65,
        "commentary": {
            "cost_efficiency": "Significant over-provisioning detected",
            "reliability": "Single-AZ database is a risk",
            "security_posture": "Reasonable but could improve",
            "scalability": "Manual scaling limits flexibility",
        },
    },
    risk_flags=[
        {"severity": "high", "resource": "prod-postgres-db", "message": "No Multi-AZ — single point of failure"},
    ],
)


@pytest_asyncio.fixture
async def client():
    """Async test client that bypasses real DB and Claude calls."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.fixture
def mock_db():
    """Mock AsyncSession that doesn't need a real database."""
    with patch("app.routers.analysis.get_db") as mock:
        db = AsyncMock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        db.flush = AsyncMock()
        db.add = AsyncMock()
        mock.return_value.__aenter__ = AsyncMock(return_value=db)
        mock.return_value.__aexit__ = AsyncMock(return_value=False)
        yield db


@pytest.fixture
def mock_claude():
    """Mock claude_service.analyze_infrastructure."""
    with patch(
        "app.services.analysis_service.claude_service.analyze_infrastructure",
        new_callable=AsyncMock,
        return_value=MOCK_CLAUDE_RESPONSE,
    ) as mock:
        yield mock
