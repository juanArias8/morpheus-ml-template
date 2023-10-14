from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.config.database.database import get_db
from app.models.schemas import Sampler
from app.services.sampler_services import SamplerService

router = APIRouter()
sampler_service = SamplerService()


@router.get("", response_model=List[Sampler])
async def get_samplers(db=Depends(get_db)):
    samplers = await sampler_service.get_samplers(db=db)
    if not samplers:
        return HTTPException(status_code=404, detail="No samplers found")
    return samplers
