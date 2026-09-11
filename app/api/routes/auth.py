from typing import Annotated 

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(
    dados: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="E-mail ou senha invalidos",
    )

    usuario = db.query(User).filter(User.email == dados.email).first()
    if usuario is None or not verify_password(dados.senha, usuario.senha_hash):
        raise credentials_exception
    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conta desativada",
        )
    
    token = create_access_token(
        subject=str(usuario.id),
        extra_claims={"papel": usuario.papel.value, "tenant_id": str(usuario.tenant_id)},
    )
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserOut)
def eu(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user