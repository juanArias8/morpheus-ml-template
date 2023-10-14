from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.models import Sampler
from app.models.schemas import Sampler as SamplerCreate


class SamplerRepository:
    @classmethod
    def create_sampler(cls, *, db: Session, sampler: SamplerCreate) -> Sampler:
        db_sampler = Sampler(
            key=sampler.key,
            name=sampler.name,
            description=sampler.description,
        )
        db.add(db_sampler)
        db.commit()
        return db_sampler

    @classmethod
    def get_samplers(cls, *, db: Session, skip: int = 0, limit: int = 100) -> List[Sampler]:
        return db.query(Sampler).offset(skip).limit(limit).all()

    @classmethod
    def get_sampler_by_key(cls, *, db: Session, sampler_key: str) -> Sampler:
        return db.query(Sampler).filter(Sampler.key == sampler_key).first()

    @classmethod
    def update_sampler(cls, *, db: Session, sampler: Sampler) -> Sampler:
        db_sampler: Sampler = db.query(Sampler).filter(Sampler.source == sampler.source).first()
        db_sampler.key = sampler.key
        db_sampler.name = sampler.name
        db_sampler.description = sampler.description
        db.commit()
        db.refresh(db_sampler)

        return db_sampler

    @classmethod
    def delete_sampler_by_source(cls, *, db: Session, sampler_source: str) -> Sampler:
        record = cls.get_sampler_by_key(db=db, sampler_key=sampler_source)
        db.delete(record)
        db.commit()
        return record
