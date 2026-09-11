from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI"

    DATABASE_URL: str = "postgresql+psycopg2://sentinel:sentinel@localhost:5432/sentinel_ai"

    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
