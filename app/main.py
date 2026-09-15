from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, cameras, investigations
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

#Origens autorizadas a chamar essa API a partir do navegador 
#Inclui o prototipo de front-end no Lovable, usado para validar as telas
#antes das rotas reais existirem, e o localhost para o desenvolvimento 
origins = [
    "https>//front-prototypes-love.lovable.app",
    "http://localhost:5173",     #porta padrão do Vite em desenvolvimento local
    "http://localhost:8080",     #porta usada pelo prototipo local (TanStack Start)
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

app.include_router(auth.router)
app.include_router(cameras.router)
app.include_router(investigations.router)

#As demais rotas (eventos, investigações, relatórios, auditoria)
#Serão incluídas aqui conforme forem criadas em app/api/routes
#seguindo o mesmo padrão: from app.api.routes import X; app.include_router(X.router)