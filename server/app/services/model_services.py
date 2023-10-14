from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.config.settings import get_settings
from app.models.schemas import MLModel
from app.repository.category_repository import ModelCategoryRepository
from app.repository.model_repository import ModelRepository

settings = get_settings()


class ModelService:
    def __init__(self):
        self.category_repository = ModelCategoryRepository()
        self.model_repository = ModelRepository()

    async def get_models(self, *, db: Session) -> List[MLModel]:
        models = self.model_repository.get_models(db=db)
        return models

    async def get_models_by_category(self, *, db: Session, category_id: UUID) -> List[MLModel]:
        return self.model_repository.get_models_by_category(db=db, category_id=category_id)

    async def get_model_by_name(self, *, db: Session, model_name: str) -> MLModel:
        return self.model_repository.get_model_by_name(db=db, model_name=model_name)
