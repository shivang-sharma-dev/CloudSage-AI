FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed by asyncpg (libpq) and gcc for native builds
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user early so pip installs land in the right place
RUN adduser --disabled-password --gecos "" appuser

# Install Python dependencies before copying app code (layer cache)
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Health check — use python3 (python:3.11-slim ships python3, not python)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run with uvicorn — single worker (scale horizontally via ECS task count)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
