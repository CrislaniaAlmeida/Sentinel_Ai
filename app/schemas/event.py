import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.event import TipoEvento

class EventoOut(BaseModel):
    id: uuid.UUID
    camera_id: uuid.UUID
    alvo_id: uuid.UUID | None
    tipo_evento: TipoEvento
    timestamp: datetime
    thumbnail_url: str | None
    clip_url: str | None
    confianca_media: float | None

    class Config:
        from_attributes = True

class BuscaInvestigacaoRequest(BaseModel):
    texto: str
    periodo_inicio: datetime | None = None
    periodo_fim: datetime | None = None
    cameras: list[str] | None = None

class BuscaInvestigacaoResponse(BaseModel):
    resultado: list[EventoOut]
    total: int 
