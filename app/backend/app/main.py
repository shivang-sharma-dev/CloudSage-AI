import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import check_db_health
from app.routers import analysis, sessions

# ─── Logging setup ────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


# ─── Lifespan ─────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 CloudSage AI starting up (env={settings.app_env}, model={settings.claude_model})")
    yield
    logger.info("CloudSage AI shutting down")


# ─── App ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CloudSage AI API",
    description="AWS Infrastructure Cost Optimization Platform — AI-powered analysis via Claude",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ─── CORS ─────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Locked down at ALB level in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request Logging Middleware ────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 1)
    logger.info(
        f"{request.method} {request.url.path} → {response.status_code} ({duration_ms}ms)"
    )
    return response


# ─── Routers ──────────────────────────────────────────────────────────────
app.include_router(analysis.router)
app.include_router(sessions.router)


# ─── Health + Info Endpoints ──────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health_check():
    """
    ALB health check endpoint.
    Returns {"status": "ok", "db": "ok"|"error", "model": "..."}
    """
    db_ok = await check_db_health()
    return {
        "status": "ok",
        "db": "ok" if db_ok else "error",
        "model": settings.claude_model,
        "version": settings.app_version,
        "env": settings.app_env,
    }


@app.get("/api/v1/info", tags=["health"])
async def app_info():
    """Application metadata endpoint."""
    return {
        "name": "CloudSage AI",
        "version": settings.app_version,
        "model": settings.claude_model,
        "environment": settings.app_env,
        "endpoints": {
            "analyze": "POST /api/v1/analyze",
            "chat": "POST /api/v1/analyze/{id}/chat",
            "sessions": "GET /api/v1/sessions",
            "health": "GET /health",
            "docs": "GET /docs",
        },
    }


# ─── Global Exception Handler ─────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )
