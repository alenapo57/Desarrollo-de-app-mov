from typing import Optional
from pydantic import BaseModel, EmailStr

# ─── Auth ────────────────────────────────────────────

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: str
    foto_perfil: Optional[str] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioResponse

class FotoPerfilUpdate(BaseModel):
    foto_perfil: Optional[str] = None

class NombreUpdate(BaseModel):
    nombre: str

# ─── Movimientos ─────────────────────────────────────

class MovimientoCreate(BaseModel):
    tipo: str
    categoria: str
    descripcion: Optional[str] = None
    monto: float
    fecha: str

class MovimientoUpdate(BaseModel):
    tipo: str
    categoria: str
    descripcion: Optional[str] = None
    monto: float
    fecha: str

class MovimientoResponse(BaseModel):
    id: int
    usuario_id: int
    tipo: str
    categoria: str
    descripcion: Optional[str]
    monto: float
    fecha: str

    class Config:
        from_attributes = True

class ResumenResponse(BaseModel):
    ingresos: float
    gastos: float
    saldo: float
