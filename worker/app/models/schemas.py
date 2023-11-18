from enum import Enum
from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.settings.settings import get_settings
from app.utils.prompts import generate_random_prompt

settings = get_settings()


class ImageCategoryEnum(str, Enum):
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
    handler: TextCategoryEnum = settings.default_text_model_handler
    user_id: str = "1111122222"


class ImageGenerationRequest(BaseModel):
    user_id: str = "1111122222"
    task_id: str = None

    # image generation
    prompt: str = "a beautiful cat with blue eyes, artwork, fujicolor, trending on artstation"
    negative_prompt: str = "bad, low res, ugly, deformed"
    width: int = 768
    height: int = 768
    num_inference_steps: int = 50
    guidance_scale: int = 10
    num_images_per_prompt: int = 1
    generator: int = -1
    strength: float = 0.8
    image: bytes = None
    mask: bytes = None

    # settings
    handler: ImageCategoryEnum = settings.default_text_model_handler
    pipeline: str = settings.default_pipeline
    scheduler: str = settings.default_scheduler
    model_source: str = settings.default_model

    class Config:
        schema_extra = {
            "example": generate_random_prompt(),
        }


class ModelRequest(ImageGenerationRequest):
    image: bytes = None
    mask: bytes = None


class Generation(BaseModel):
    id: UUID
    results: List[str] = []
    status: str = "PENDING"
