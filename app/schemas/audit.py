import uuid
from datetime import datetime

from pydantic import BaseModel

class LogAuditoriaOut(BaseModel):
    id: uuid.UUID
    usuario_id: uuid.UUID
    usuario_nome: str | None = None
    usuario_email: str | None = None
    acao: str
    entidade_afetada: str | None
    ip_origem: str | None
    timestamp: datetime

    class Config:
        from_attributes = True
