from datetime import datetime
from typing import Optional, List
from uuid import UUID

from app.config.settings import get_settings
from pydantic import BaseModel

settings = get_settings()


class BasicModel(BaseModel):
    created_at: datetime = None
    updated_at: datetime = None


class User(BaseModel):
    email: str
    name: str = None
    avatar: str = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "morpheus@user.com",
                "name": "Morpheus",
                "avatar": "https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png",  # noqa
            }
        }


class TextGenerationRequest(BaseModel):
    task_id: UUID = None
    prompt: str = "Hey, Are you there?"
    model_name: str = "ChatGLM-6B"


class ImageGenerationRequest(BaseModel):
    task_id: UUID = None
    prompt: str = "a beautiful cat with blue eyes, artwork, fujicolor, trending on artstation"
    negative_prompt: str = "bad, low res, ugly, deformed"
    width: int = 768
    height: int = 768
    num_inference_steps: int = 50
    guidance_scale: int = 10
    num_images_per_prompt: int = 1
    generator: int = -1
    strength: Optional[float] = 0.75
    sampler: str = "DDPMScheduler"
    model_name: str = "Stable Diffusion XL Text2Img"


class Generation(BaseModel):
    id: UUID
    results: List[str] = []
    status: str = "PENDING"

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "c0a80121-7ac0-11eb-9439-0242ac130002",
                "results": ["https://imageurl.png"],
                "status": "PENDING",
            }
        }


class Sampler(BaseModel):
    id: UUID = None
    key: str
    name: str
    description: str = None


class ModelCategory(BasicModel):
    id: UUID = None
    name: str
    description: str = None

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "c0a80121-7ac0-11eb-9439-0242ac130002",
                "name": "Category Name",
                "description": "Category description",
            }
        }


class MLModel(BasicModel):
    id: UUID = None
    name: str
    source: str
    description: str = None
    url_docs: str = None
    categories: List[ModelCategory] = None
    extra_params: dict = None
    is_active: bool = True

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Model Name",
                "source": "https://modelurl.com",
                "kind": "diffusion",
                "description": "Model description",
                "url_docs": "https://modeldocs.com",
                "is_active": True,
            }
        }


class NewsletterRegister(BaseModel):
    email: str

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@email.com",
            }
        }
