from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(data: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Usuario).filter(
        models.Usuario.email == data.email.lower().strip()
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una cuenta con ese email."
        )

    user = models.Usuario(
        nombre=data.nombre.strip(),
        email=data.email.lower().strip(),
        password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": user,
    }

@router.post("/login", response_model=schemas.TokenResponse)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(
        models.Usuario.email == data.email.lower().strip()
    ).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos."
        )

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": user,
    }

@router.put("/foto", response_model=schemas.UsuarioResponse)
def update_foto_perfil(
    data: schemas.FotoPerfilUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    current_user.foto_perfil = data.foto_perfil
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/nombre", response_model=schemas.UsuarioResponse)
def update_nombre(
    data: schemas.NombreUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    if not data.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre no puede estar vacío.")
    current_user.nombre = data.nombre.strip()
    db.commit()
    db.refresh(current_user)
    return current_user
