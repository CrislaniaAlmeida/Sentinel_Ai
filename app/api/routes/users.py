from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.audit import registrar_auditoria
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserOut

router = APIRouter(prefix="/api/usuarios", tags=["usuarios"])


@router.get("", response_model=list[UserOut])
def listar_usuarios(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> list[User]:
    return db.query(User).filter(User.tenant_id == current_user.tenant_id).all()


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def criar_usuario(
    dados: UserCreate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> User:
    existente = db.query(User).filter(User.email == dados.email).first()
    if existente is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário com esse e-mail",
        )

    novo_usuario = User(
        tenant_id=current_user.tenant_id,
        nome=dados.nome,
        email=dados.email,
        senha_hash=hash_password(dados.senha),
        papel=dados.papel,
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    registrar_auditoria(db, current_user, "criar_usuario", request, entidade_afetada=str(novo_usuario.id))

    return novo_usuario