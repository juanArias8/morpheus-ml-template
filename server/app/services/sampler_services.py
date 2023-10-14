from typing import List

from sqlalchemy.orm import Session

from app.config.settings import get_settings
from app.models.schemas import Sampler
from app.repository.sampler_repository import SamplerRepository

settings = get_settings()


class SamplerService:
    def __init__(self):
        self.sampler_repository = SamplerRepository()

    async def get_samplers(self, *, db: Session) -> List[Sampler]:
        samplers = self.sampler_repository.get_samplers(db=db)
        return samplers
