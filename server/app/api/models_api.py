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
    try:
        sd_model = await model_service.get_models(db=db)
        return sd_model
    except Exception as e:
        error = f"Something went wrong while getting models: {str(e)}"
        return HTTPException(status_code=500, detail=error)


@router.get("/{category_id}", response_model=List[MLModel])
async def get_models_by_category_id(category_id: UUID, db: Session = Depends(get_db)):
    try:
        sd_model = await model_service.get_models_by_category(db=db, category_id=category_id)
        return sd_model
    except Exception as e:
        error = f"Something went wrong while getting models: {str(e)}"
        return HTTPException(status_code=500, detail=error)
