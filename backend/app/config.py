from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql+asyncpg://cloudsage:cloudsage@localhost:5432/cloudsage"

    # Anthropic / Claude
    anthropic_api_key: str = "sk-ant-placeholder"
    claude_model: str = "claude-sonnet-4-20250514"
    claude_max_tokens: int = 8192
    claude_temperature: float = 0.1  # Low temp for deterministic JSON output

    # App
    app_env: str = "development"
    app_version: str = "1.0.0"
    log_level: str = "INFO"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
