from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.audit_log import LogAuditoria
from app.models.user import User
from app.schemas.audit import LogAuditoriaOut

router = APIRouter(prefix="/api/auditoria", tags=["auditoria"])

@router.get("/logs", response_model=list[LogAuditoriaOut])
def listar_logs(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> list[LogAuditoriaOut]:
    resultados = (
        db.query(LogAuditoria, User.nome, User.email)
        .join(User, User.id == LogAuditoria.usuario_id)
        .filter(LogAuditoria.tenant_id == current_user.tenant_id)
        .order_by(LogAuditoria.timestamp.desc())
        .limit(200)
        .all()
    )
    return [
        LogAuditoriaOut(
            id=log.id,
            usuario_id=log.usuario_id,
            usuario_nome=nome,
            usuario_email=email,
            acao=log.acao,
            entidade_afetada=log.entidade_afetada,
            ip_origem=log.ip_origem,
            timestamp=log.timestamp,
        )
        for log, nome, email in resultados
    ]
