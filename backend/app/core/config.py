"""
Central app configuration. Everything pulls from environment variables so the
same codebase runs locally (SQLite + .env) and in production (Postgres on
Render + dashboard env vars) without code changes.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "Teens Helpline API"
    ENVIRONMENT: str = "development"  # development | production

    # --- Database ---
    # Defaults to a local SQLite file so the project runs with zero setup.
    # In production, set DATABASE_URL to a Postgres connection string.
    DATABASE_URL: str = "sqlite:///./teens_helpline.db"

    # --- Auth / JWT ---
    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_ENV_VARS"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- CORS ---
    # Comma-separated list of allowed frontend origins.
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # --- Gemini ---
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"

    # --- Admin bootstrap ---
    # Used once on startup to seed a default admin account if none exists.
    DEFAULT_ADMIN_EMAIL: str = "admin@teenshelpline.org"
    DEFAULT_ADMIN_PASSWORD: str = "ChangeThisPassword123!"

    class Config:
        env_file = ".env"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
