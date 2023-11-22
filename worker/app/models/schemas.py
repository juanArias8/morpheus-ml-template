from enum import Enum
from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.settings.settings import get_settings
from app.utils.prompts import generate_random_prompt

settings = get_settings()


class ImageHandlerEnum(str, Enum):
    # Text to image
    TEXT_TO_IMAGE_SDXL = "text2img-sdxl"
    TEXT_TO_IMAGE_RUNWAY = "text2img-runway"
    TEXT_TO_IMAGE_SDV2 = "text2img-sdv2"
    TEXT_TO_IMAGE_OPENJOURNEY = "text2img-openjourney"

    # Image to image
    IMAGE_TO_IMAGE_SDXL = "img2img-sdxl"
    IMAGE_TO_IMAGE_PIX2PIX = "img2img-pix2pix"
    IMAGE_TO_IMAGE_SDV2 = "img2img-sdv2"

    # Inpainting
    INPAINTING_SDXL = "inpainting-sdxl"
    INPAINTING_RUNWAY = "inpainting-runway"
    INPAINTING_SDV2 = "inpainting-sdv2"


class TextHandlerEnum(str, Enum):
    # Question answering
    QUESTION_ANSWERING_FALCON = "question-answering-falcon"
    QUESTION_ANSWERING_DISTILBERT = "question-answering-distilbert"

    # Text to text
    TEXT_TO_TEXT_GOOGLE_FLAN = "text2text-google-flan"
    TEXT_TO_TEXT_ALCAPA = "text2text-alcapa"

    # Text classification
    TEXT_CLASSIFICATION_BART_NLI = "text-classification-bart-nli"
    TEXT_CLASSIFICATION_BART = "text-classification-bart"
    TEXT_CLASSIFICATION_TOXIC_BERT = "text-classification-toxic-bert"
    TEXT_CLASSIFICATION_ROBERTA = "text-classification-roberta"

    # Text conversational
    TEXT_CONVERSATIONAL_BLENDERBOT = "text-conversational-blenderbot"
    TEXT_CONVERSATIONAL_CHAT_GLM = "text-conversational-chat-glm"

    # Text generation
    TEXT_GENERATION_GPT2 = "text-generation-gpt2"
    TEXT_GENERATION_PHI15 = "text-generation-phi15"
    TEXT_GENERATION_GPT = "text-generation-gpt"
    TEXT_GENERATION_STABLE_BELUGA = "text-generation-stable-beluga"

    # Text summarization
    TEXT_SUMMARIZATION_BART = "text-summarization-bart"
    TEXT_SUMMARIZATION_DISTIL_BART = "text-summarization-distilbart"


class TextGenerationRequest(BaseModel):
    handler: TextHandlerEnum = settings.default_text_model_handler
    user_id: str = "1111122222"
    task_id: str = None
    prompt: str = "Hello, Are you there?"
    context: str = None


class ImageGenerationRequest(BaseModel):
    handler: ImageHandlerEnum = settings.default_text_model_handler
    user_id: str = "1111122222"
    task_id: str = None

    # image generation
    scheduler: str = settings.default_scheduler
    prompt: str = "a beautiful cat with blue eyes, artwork, fujicolor, trending on artstation"
    negative_prompt: str = "bad, low res, ugly, deformed"
    width: int = 768
    height: int = 768
    num_inference_steps: int = 50
    guidance_scale: int = 10
    num_images_per_prompt: int = 1
    generator: int = -1
    strength: float = None
    image: bytes = None
    mask: bytes = None

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
