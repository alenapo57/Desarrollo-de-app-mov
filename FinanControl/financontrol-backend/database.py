from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "Falta DATABASE_URL. Copiá .env.example a .env y completá la URL de la base de datos."
    )

# Neon suspende la base cuando no se usa y corta las conexiones abiertas.
# pool_pre_ping verifica cada conexión antes de usarla (si está muerta, abre otra)
# y pool_recycle descarta las que tienen más de 5 minutos, para no reutilizar
# conexiones que Neon ya cerró.
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
