from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

from app.config.database.database import get_db
from app.models.schemas import MLModel
from app.services.model_services import ModelService

router = APIRouter()
model_service = ModelService()


@router.get("", response_model=List[MLModel])
async def get_sd_models(db: Session = Depends(get_db)):
    sd_model = await model_service.get_models(db=db)
    if not sd_model:
        return HTTPException(status_code=404, detail="No ML Models found")
    return sd_model


@router.get("/{category_id}", response_model=List[MLModel])
async def get_models_by_category_id(category_id: UUID, db: Session = Depends(get_db)):
    sd_model = await model_service.get_models_by_category(db=db, category_id=category_id)
    if not sd_model:
        return HTTPException(status_code=404, detail="No ML Models found")
    return sd_model
