from typing import List

from app.config.database.database import get_db
from app.models.schemas import Sampler
from app.services.sampler_services import SamplerService
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()
sampler_service = SamplerService()


@router.get("", response_model=List[Sampler])
async def get_samplers(db=Depends(get_db)):
    try:
        samplers = await sampler_service.get_samplers(db=db)
        return samplers
    except Exception as e:
        error = f"Something went wrong while getting samplers: {str(e)}"
        return HTTPException(status_code=500, detail=error)
