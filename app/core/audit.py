from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit_log import LogAuditoria
from app.models.user import User

def registrar_auditoria(
    db: Session,
    usuario: User,
    acao: str,
    request: Request,
    entidade_afetada: str | None = None,
) -> None:
    log = LogAuditoria(
        tenant_id=usuario.tenant_id,
        usuario_id=usuario.id,
        acao=acao,
        entidade_afetada=entidade_afetada,
        ip_origem=request.client.host if request.client else None,
    )
    db.add(log)
    db.commit()