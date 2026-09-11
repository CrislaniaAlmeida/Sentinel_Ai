import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, Enum, Float, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RestricaoStatus(str, enum.Enum):
    NENHUMA = "nenhuma"
    RESTRITO = "restrito"
    NAO_VERIFICADO = "nao_verificado"


class Pessoa(Base):
    __tablename__ = "pessoas"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    atributos: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    face_confianca: Mapped[float | None] = mapped_column(Float, nullable=True)
    criado_em: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Veiculo(Base):
    __tablename__ = "veiculos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    placa: Mapped[str] = mapped_column(String(16), index=True, nullable=False)
    cor: Mapped[str | None] = mapped_column(String(64), nullable=True)
    modelo: Mapped[str | None] = mapped_column(String(128), nullable=True)
    status_restricao: Mapped[RestricaoStatus] = mapped_column(
        Enum(RestricaoStatus), default=RestricaoStatus.NAO_VERIFICADO
    )
    criado_em: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    