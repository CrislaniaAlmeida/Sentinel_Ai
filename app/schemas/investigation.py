import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.investigation import InvestigacaoStatus

class InvestigacaoOut(BaseModel):
    id: uuid.UUID
    usuario_id: uuid.UUID
    criterios_busca_json: dict | None
    status: InvestigacaoStatus
    criado_em: datetime
    fechado_em: datetime | None

    class Config:
        from_attributes = True

class RelatorioCreate(BaseModel):
    investigacao_id: uuid.UUID

class RelatorioOut(BaseModel):
    id: uuid.UUID
    investigacao_id: uuid.UUID
    pdf_url: str | None
    gerado_em: datetime

    class Config:
        from_attributes = True