import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import registrar_auditoria
from app.db.session import get_db
from app.models.investigation import Investigacao, Relatorio
from app.models.user import User
from app.schemas.investigation import RelatorioCreate, RelatorioOut

router = APIRouter(prefix="/api/relatorios", tags=["relatorios"])


@router.post("", response_model=RelatorioOut, status_code=status.HTTP_201_CREATED)
def criar_relatorio(
    dados: RelatorioCreate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Relatorio:
    investigacao = (
        db.query(Investigacao)
        .filter(
            Investigacao.id == dados.investigacao_id,
            Investigacao.tenant_id == current_user.tenant_id,
        )
        .first()
    )
    if investigacao is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investigação não encontrada",
        )

    # NOTA: a geração real do arquivo PDF (RF09, Capítulo 5) ainda não existe.
    # O registro do relatório já é criado e vinculado à investigação; pdf_url
    # fica nulo até que um gerador de PDF real seja implementado.
    novo_relatorio = Relatorio(
        tenant_id=current_user.tenant_id,
        investigacao_id=investigacao.id,
        pdf_url=None,
    )
    db.add(novo_relatorio)
    db.commit()
    db.refresh(novo_relatorio)

    registrar_auditoria(
        db, current_user, "gerar_relatorio", request, entidade_afetada=str(novo_relatorio.id)
    )

    return novo_relatorio


@router.get("/{relatorio_id}", response_model=RelatorioOut)
def obter_relatorio(
    relatorio_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Relatorio:
    relatorio = (
        db.query(Relatorio)
        .filter(Relatorio.id == relatorio_id, Relatorio.tenant_id == current_user.tenant_id)
        .first()
    )
    if relatorio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Relatório não encontrado")
    return relatorio