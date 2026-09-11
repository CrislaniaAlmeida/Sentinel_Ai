from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)


@app.get("/health", tags=["infra"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.PROJECT_NAME}


@app.get("/", tags=["infra"])
def root() -> dict[str, str]:
    return {"message": f"{settings.PROJECT_NAME} online", "docs": "/docs"}
