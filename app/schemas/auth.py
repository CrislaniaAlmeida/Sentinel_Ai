import uuid

from pydantic import BaseModel, EmailStr

from app.models.user import UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: uuid.UUID
    nome: str
    email: EmailSrt
    papel: UserRole
    ativo: bool

class Config:
    from_attributes = True