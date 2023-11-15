from enum import Enum
from typing import Optional, List
from uuid import UUID

from app.settings.settings import get_settings
from app.utils.prompts import generate_random_prompt
from pydantic import BaseModel

settings = get_settings()


class CategoryEnum(str, Enum):
    TEXT_TO_IMAGE = "text2img"
    IMAGE_TO_IMAGE = "img2img"
    INPAINTING = "inpainting"


class TextCategoryEnum(str, Enum):
    MAGIC_PROMPT = "magic_prompt"
    LLAMA2 = "llama2"
    ALPACA = "alpaca"
    CHAT_GLM = "chat_glm"


class TextGenerationRequest(BaseModel):
    task_id: str = None
    prompt: str = "Hello, Are you there?"
    handler: str = settings.default_model_handler
    user_id: str = "1111122222"


class ImageGenerationRequest(BaseModel):
    task_id: str = None
    prompt: str = "a beautiful cat with blue eyes, artwork, fujicolor, trending on artstation"
    negative_prompt: str = "bad, low res, ugly, deformed"
    width: int = 768
    height: int = 768
    num_inference_steps: int = 50
    guidance_scale: int = 10
    num_images_per_prompt: int = 1
    generator: int = -1
    strength: Optional[float] = 0.8
    pipeline: str = settings.default_pipeline
    scheduler: str = settings.default_scheduler
    model_source: str = settings.default_model
    user_id: str = "1111122222"

    class Config:
        schema_extra = {
            "example": generate_random_prompt(),
        }


class ModelRequest(ImageGenerationRequest):
    image: Optional[bytes] = None
    mask: Optional[bytes] = None


class Generation(BaseModel):
    id: UUID
    results: List[str] = []
    status: str = "PENDING"
