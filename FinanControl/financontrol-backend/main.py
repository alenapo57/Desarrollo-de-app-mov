from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import usuarios, movimientos

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FinanControl API",
    description="Backend para la app de finanzas personales FinanControl",
    version="1.0.0",
)

# CORS — permite requests desde React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(movimientos.router)

@app.get("/")
def root():
    return {"message": "FinanControl API corriendo ✅"}