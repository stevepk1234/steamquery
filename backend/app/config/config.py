from pydantic import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file = "../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # MongoDB config
    MONGO_URI: str
    MONGO_PORT: str
    MONGO_DB: str

settings = Settings()