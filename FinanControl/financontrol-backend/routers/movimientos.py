from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])

@router.get("/", response_model=List[schemas.MovimientoResponse])
def get_movimientos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    return db.query(models.Movimiento).filter(
        models.Movimiento.usuario_id == current_user.id
    ).order_by(models.Movimiento.fecha.desc(), models.Movimiento.id.desc()).all()

@router.get("/resumen", response_model=schemas.ResumenResponse)
def get_resumen(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    from sqlalchemy import case

    result = db.query(
        func.coalesce(func.sum(
            case(
                (models.Movimiento.tipo == "Ingreso", models.Movimiento.monto),
                else_=0
            )
        ), 0).label("ingresos"),
        func.coalesce(func.sum(
            case(
                (models.Movimiento.tipo == "Gasto", models.Movimiento.monto),
                else_=0
            )
        ), 0).label("gastos"),
    ).filter(models.Movimiento.usuario_id == current_user.id).first()

    return {
        "ingresos": result.ingresos,
        "gastos": result.gastos,
        "saldo": result.ingresos - result.gastos,
    }

@router.get("/recientes", response_model=List[schemas.MovimientoResponse])
def get_recientes(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    return db.query(models.Movimiento).filter(
        models.Movimiento.usuario_id == current_user.id
    ).order_by(models.Movimiento.fecha.desc(), models.Movimiento.id.desc()).limit(5).all()

@router.post("/", response_model=schemas.MovimientoResponse, status_code=201)
def create_movimiento(
    data: schemas.MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    movimiento = models.Movimiento(
        usuario_id=current_user.id,
        tipo=data.tipo,
        categoria=data.categoria,
        descripcion=data.descripcion,
        monto=data.monto,
        fecha=data.fecha,
    )
    db.add(movimiento)
    db.commit()
    db.refresh(movimiento)
    return movimiento

@router.put("/{movimiento_id}", response_model=schemas.MovimientoResponse)
def update_movimiento(
    movimiento_id: int,
    data: schemas.MovimientoUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    movimiento = db.query(models.Movimiento).filter(
        models.Movimiento.id == movimiento_id,
        models.Movimiento.usuario_id == current_user.id
    ).first()

    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado.")

    movimiento.tipo = data.tipo
    movimiento.categoria = data.categoria
    movimiento.descripcion = data.descripcion
    movimiento.monto = data.monto
    movimiento.fecha = data.fecha
    db.commit()
    db.refresh(movimiento)
    return movimiento

@router.delete("/{movimiento_id}", status_code=204)
def delete_movimiento(
    movimiento_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    movimiento = db.query(models.Movimiento).filter(
        models.Movimiento.id == movimiento_id,
        models.Movimiento.usuario_id == current_user.id
    ).first()

    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado.")

    db.delete(movimiento)
    db.commit()