import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, Enum, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TipoEvento(str, enum.Enum):
    PESSOA_DETECTADA = "pessoa_detectada"
    VEICULO_DETECTADO = "veiculo_detectado"
    ALERTA_CONFIGURADO = "alerta_configurado"


class TipoDeteccao(str, enum.Enum):
    PESSOA = "pessoa"
    VEICULO = "veiculo"


class Evento(Base):
    __tablename__ = "eventos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id"), nullable=False)
    alvo_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    tipo_evento: Mapped[TipoEvento] = mapped_column(Enum(TipoEvento), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(nullable=False, index=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    clip_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    confianca_media: Mapped[float | None] = mapped_column(Float, nullable=True)


class Deteccao(Base):
    __tablename__ = "deteccoes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    evento_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("eventos.id"), nullable=False)
    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id"), nullable=False)
    tipo: Mapped[TipoDeteccao] = mapped_column(Enum(TipoDeteccao), nullable=False)
    bbox_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    confianca: Mapped[float] = mapped_column(Float, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(nullable=False)