import uuid

from sqlalchemy import ARRAY, DateTime, Enum, Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.config.database.database import Base


class BaseModel(Base):
    __abstract__ = True

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(BaseModel):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(64), unique=True, index=True)
    name = Column(String(64), nullable=True)
    bio = Column(String(512), nullable=True)
    avatar = Column(String(512), nullable=True)
    generations = relationship("Generation", back_populates="user")


class Generation(BaseModel):
    __tablename__ = "generation"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    results = Column(ARRAY(String), nullable=True)
    status = Column(
        Enum("PENDING", "COMPLETED", "FAILED", name="generation_status"),
        nullable=False,
        default="PENDING",
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    user = relationship("User", back_populates="generations")


class ModelCategory(BaseModel):
    __tablename__ = "model_category"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String(64), unique=True)
    name = Column(String(64))
    description = Column(String(512), nullable=True)
    models = relationship("MLModel", back_populates="category")


class MLModel(BaseModel):
    __tablename__ = "ml_model"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(64), nullable=False)
    handler = Column(String(64), nullable=False, unique=True)
    description = Column(String(512), nullable=True)
    url_docs = Column(String(512), nullable=True)
    extra_params = Column(JSON, nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("model_category.id"))
    category = relationship("ModelCategory", back_populates="models")


class Sampler(BaseModel):
    __tablename__ = "sampler"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String(64))
    name = Column(String(64))
    description = Column(String(512), nullable=True)


class Newsletter(BaseModel):
    __tablename__ = "newsletter"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(64), unique=True, index=True)
