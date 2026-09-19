from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import audit, auth, cameras, investigations, users
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

origins = [
    "https://front-prototypes-love.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://lustrous-axolotl-52b80e.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}

app.include_router(audit.router)
app.include_router(auth.router)
app.include_router(cameras.router)
app.include_router(investigations.router)
app.include_router(users.router)

# As demais rotas (eventos, relatorios)
# Serao incluidas aqui conforme forem criadas em app/api/routes
# seguindo o mesmo padrao: from app.api.routes import X; app.include_router(X.router)