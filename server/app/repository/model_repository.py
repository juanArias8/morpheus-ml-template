from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.models import MLModel, ModelCategory
from app.models.schemas import MLModel as MLModelSchema


class ModelRepository:
    @classmethod
    def create_model(
        cls, *, db: Session, model: MLModelSchema, category: ModelCategory
    ) -> MLModelSchema:
        db_model = MLModel(
            name=model.name,
            handler=model.handler,
            description=model.description,
            url_docs=model.url_docs,
            extra_params=model.extra_params,
        )
        db_model.category = category
        db.add(db_model)
        db.commit()
        db.refresh(db_model)
        return db_model

    @classmethod
    def get_models(
        cls, *, db: Session, skip: int = 0, limit: int = 100
    ) -> List[MLModelSchema]:
        models = db.query(MLModel).offset(skip).limit(limit).all()
        return models

    @classmethod
    def get_model_by_id(cls, *, db: Session, model_id: UUID) -> MLModelSchema:
        return db.query(MLModel).filter(MLModel.id == model_id).first()

    @classmethod
    def get_models_by_category(
        cls, *, db: Session, category_id: UUID
    ) -> list[MLModelSchema]:
        return db.query(MLModel).filter(MLModel.category.id == category_id).all()

    @classmethod
    def get_model_by_source(cls, *, db: Session, model_source: str) -> MLModelSchema:
        return db.query(MLModel).filter(MLModel.name == model_source).first()

    @classmethod
    def get_model_by_handler(cls, *, db: Session, handler: str) -> MLModelSchema:
        return db.query(MLModel).filter(MLModel.handler == handler).first()

    @classmethod
    def update_model(cls, *, db: Session, model: MLModel) -> MLModelSchema:
        db_model: MLModel = (
            db.query(MLModel).filter(MLModel.source == model.source).first()
        )

        db_model.name = model.name
        db_model.handler = model.handler
        db_model.description = model.description
        db_model.url_docs = model.url_docs
        db_model.categories = model.categories
        db_model.extra_params = model.extra_params
        db_model.is_active = model.is_active
        db.commit()
        db.refresh(db_model)

        return db_model

    @classmethod
    def delete_model_by_handler(
        cls, *, db: Session, model_handler: str
    ) -> MLModelSchema:
        record = cls.get_model_by_handler(db=db, handler=model_handler)
        db.delete(record)
        db.commit()
        return record
