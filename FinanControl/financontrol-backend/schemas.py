import base64
import binascii
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

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

# La foto se guarda en la base como "data URI": la imagen entera codificada en
# base64 con un prefijo que indica el formato (ej: "data:image/jpeg;base64,/9j/4AAQ...").
# La app la achica a 300x300 antes de mandarla, así que pesa unos 20-60 KB.
FOTO_PREFIJOS_VALIDOS = ("data:image/jpeg;base64,", "data:image/png;base64,", "data:image/webp;base64,")
FOTO_MAX_CARACTERES = 200_000  # ~150 KB de imagen: margen amplio, pero corta fotos sin achicar

class FotoPerfilUpdate(BaseModel):
    foto_perfil: Optional[str] = None  # None = eliminar la foto

    @field_validator("foto_perfil")
    @classmethod
    def validar_foto(cls, valor: Optional[str]) -> Optional[str]:
        if valor is None:
            return None
        if not valor.startswith(FOTO_PREFIJOS_VALIDOS):
            raise ValueError("La foto debe ser una imagen JPEG, PNG o WEBP en base64.")
        if len(valor) > FOTO_MAX_CARACTERES:
            raise ValueError("La foto es demasiado grande.")
        try:
            base64.b64decode(valor.split(",", 1)[1], validate=True)
        except (binascii.Error, ValueError):
            raise ValueError("La foto no es un base64 válido.")
        return valor

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
