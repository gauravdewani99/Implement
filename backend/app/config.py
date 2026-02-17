from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings

# Look for .env in the project root (one level above backend/)
_env_file = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/implement"
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    cors_origins: str = "http://localhost:5173"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    model_config = {"env_file": str(_env_file), "extra": "ignore"}

    @model_validator(mode="after")
    def normalize_database_url(self) -> "Settings":
        """Convert postgres:// or postgresql:// to postgresql+asyncpg://."""
        url = self.database_url
        if url.startswith("postgres://"):
            self.database_url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and "+asyncpg" not in url:
            self.database_url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return self


settings = Settings()
