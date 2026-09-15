import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import registrar_auditoria
from app.db.session import get_db
from app.models.camera import Camera
from app.models.user import User
from app.schemas.camera import CameraCreate, CameraOut

router = APIRouter(prefix="/api/cameras", tags=["cameras"])


@router.get("", response_model=list[CameraOut])
def listar_cameras(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[Camera]:
    return db.query(Camera).filter(Camera.tenant_id == current_user.tenant_id).all()


@router.post("", response_model=CameraOut, status_code=status.HTTP_201_CREATED)
def criar_camera(
    dados: CameraCreate,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Camera:
    nova_camera = Camera(**dados.model_dump(), tenant_id=current_user.tenant_id)
    db.add(nova_camera)
    db.commit()
    db.refresh(nova_camera)

    registrar_auditoria(db, current_user, "criar_camera", request, entidade_afetada=str(nova_camera.id))

    return nova_camera


@router.get("/{camera_id}", response_model=CameraOut)
def obter_camera(
    camera_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Camera:
    camera = (
        db.query(Camera)
        .filter(Camera.id == camera_id, Camera.tenant_id == current_user.tenant_id)
        .first()
    )
    if camera is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Câmera não encontrada")
    return camera