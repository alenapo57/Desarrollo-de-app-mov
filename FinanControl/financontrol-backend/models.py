from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String, nullable=False)
    email       = Column(String, unique=True, nullable=False, index=True)
    password    = Column(String, nullable=False)
    foto_perfil = Column(Text, nullable=True)

    movimientos = relationship("Movimiento", back_populates="usuario")


class Movimiento(Base):
    __tablename__ = "movimientos"

    id          = Column(Integer, primary_key=True, index=True)
    usuario_id  = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo        = Column(String, nullable=False)
    categoria   = Column(String, nullable=False)
    descripcion = Column(Text, nullable=True)
    monto       = Column(Float, nullable=False)
    fecha       = Column(String, nullable=False)

    usuario = relationship("Usuario", back_populates="movimientos")