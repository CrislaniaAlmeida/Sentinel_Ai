import uuid

from pydantic import BaseModel

from app.models.camera import CameraStatus

class CameraCreate(BaseModel):
    nome: str
    local_instalacao: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    stsp_url: str

class CameraOut(BaseModel):
    id: uuid.UUID
    nome: str
    local_instalacao: str | None
    latitude: float | None
    longitude: float | None
    status: CameraStatus

    class Config:
        from_attributes = True