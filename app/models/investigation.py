import enum
import uuid
from datetime import datetime

from sqlalchemy import JSON, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class InvestigacaoStatus(str, enum.Enum):
    ABERTA = "aberta"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDA = "concluida"


class Investigacao(Base):
    __tablename__ = "investigacoes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    usuario_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    criterios_busca_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status: Mapped[InvestigacaoStatus] = mapped_column(Enum(InvestigacaoStatus), default=InvestigacaoStatus.ABERTA)
    criado_em: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    fechado_em: Mapped[datetime | None] = mapped_column(nullable=True)


class InvestigacaoEvento(Base):
    __tablename__ = "investigacao_eventos"

    investigacao_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("investigacoes.id"), primary_key=True
    )
    evento_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("eventos.id"), primary_key=True)
    adicionado_em: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Relatorio(Base):
    __tablename__ = "relatorios"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    investigacao_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("investigacoes.id"), nullable=False
    )
    pdf_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    gerado_em: Mapped[datetime] = mapped_column(default=datetime.utcnow)