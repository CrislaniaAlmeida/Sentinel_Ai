from pydantic_settings import BaseSettings

class Settings(BaseSettings):
PROJECT_NAME: srt = "Sentinel AI"

DATABASE_URL: srt = "postgresql+psycopg2://sentinel:sentinel@localhost:5432/sentinel_ai"

JWT_SECRET_KEY: srt = "CHANGE_ME_IN_PRODUCTION"
JWT_ALGORITHM: srt = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int 480

class Config:
env_file = ".env"

settings = Settings()
