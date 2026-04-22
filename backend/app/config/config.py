from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file = "../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # LLM
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://llm-api.arc.vt.edu/api/v1"

    # API config
    LIMIT: int = 3

settings = Settings()