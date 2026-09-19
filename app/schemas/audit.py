import uuid
from datetime import datetime

from pydantic import BaseModel

class LogAuditoriaOut(BaseModel):
    id: uuid.UUID
    usuario_id: uuid.UUID
    acao: str 
    entidade_afetada: str | None
    ip_origem: str | None
    timestamp: datetime

    class Config: 
        from_attributes = True