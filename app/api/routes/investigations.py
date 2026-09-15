import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import registrar_auditoria
from app.db.session import get_db
from app.models.event import Evento
from app.models.investigation import Investigacao, InvestigacaoEvento
from app.models.user import User
from app.schemas.event import BuscaInvestigacaoRequest, BuscaInvestigacaoResponse

router = APIRouter(prefix="/api/investigacoes", tags=["investigacoes"])


@router.post("/busca", response_model=BuscaInvestigacaoResponse)
def buscar_investigacao(
    dados: BuscaInvestigacaoRequest,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> BuscaInvestigacaoResponse:
    query = db.query(Evento).filter(Evento.tenant_id == current_user.tenant_id)

    if dados.periodo_inicio:
        query = query.filter(Evento.timestamp >= dados.periodo_inicio)
    if dados.periodo_fim:
        query = query.filter(Evento.timestamp <= dados.periodo_fim)

    if dados.cameras:
        camera_ids = []
        for valor in dados.cameras:
            try:
                camera_ids.append(uuid.UUID(valor))
            except ValueError:
                continue
        if camera_ids:
            query = query.filter(Evento.camera_id.in_(camera_ids))

    # NOTA: o filtro por "dados.texto" (busca em linguagem natural) ainda não é
    # aplicado aqui porque os eventos ainda não têm um campo de descrição
    # pesquisável — isso é gerado pelo motor de IA (Engenheiro 1), que ainda
    # não foi iniciado. O texto é salvo em criterios_busca_json abaixo, pronto
    # para uso assim que essa peça existir.

    eventos = query.order_by(Evento.timestamp.desc()).all()

    investigacao = Investigacao(
        tenant_id=current_user.tenant_id,
        usuario_id=current_user.id,
        criterios_busca_json=dados.model_dump(mode="json"),
    )
    db.add(investigacao)
    db.commit()
    db.refresh(investigacao)

    for evento in eventos:
        db.add(InvestigacaoEvento(investigacao_id=investigacao.id, evento_id=evento.id))
    db.commit()

    registrar_auditoria(
        db, current_user, "busca_investigacao", request, entidade_afetada=str(investigacao.id)
    )

    return BuscaInvestigacaoResponse(resultados=eventos, total=len(eventos))