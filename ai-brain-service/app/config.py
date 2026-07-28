from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Company Brain - Knowledge Service"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8001

    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:8000",
            "http://localhost:5173",
        ]
    )

    chroma_path: str = "data/chroma"
    chroma_default_collection: str = "company_knowledge"
    chroma_collection: str = "company_knowledge"

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    google_credentials_path: str = "secrets/credentials.json"
    google_token_path: str = "secrets/token.json"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def chroma_persist_path(self) -> Path:
        return Path(self.chroma_path)

    @property
    def google_credentials_file(self) -> Path:
        return Path(self.google_credentials_path)

    @property
    def google_token_file(self) -> Path:
        return Path(self.google_token_path)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
