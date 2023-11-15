from typing import Union

from sqlalchemy.orm import Session

from app.error.generation import GenerationNotFoundError
from app.error.model import ModelNotFoundError
from app.error.user import UserNotFoundError
from app.integrations.ray_ai_client import RayAIClient
from app.models.schemas import ImageGenerationRequest, TextGenerationRequest
from app.repository.generation_repository import GenerationRepository
from app.repository.model_repository import ModelRepository
from app.repository.user_repository import UserRepository


class GenerationServices:
    def __init__(self):
        self.generator = RayAIClient()
        self.generation_repository = GenerationRepository()
        self.model_repository = ModelRepository()
        self.user_repository = UserRepository()

    def get_generation_result(self, db: Session, task_id: str) -> str:
        generation = self.generation_repository.get_generation(db=db, generation_id=task_id)
        if generation is None:
            raise GenerationNotFoundError(f"Generation with id {task_id} not found")
        return generation

    def generate_text2img_images(self, db: Session, request: ImageGenerationRequest, email: str) -> str:
        backend_request = self._build_ray_image_request(db=db, request=request, email=email)
        return self.generator.generate_text2img_images(request=backend_request)

    def generate_img2img_images(self, db: Session, request: ImageGenerationRequest, image: bytes, email: str) -> str:
        backend_request = self._build_ray_image_request(db=db, request=request, email=email)
        return self.generator.generate_img2img_images(request=backend_request, image=image)

    def generate_inpainting_images(
            self, db: Session,
            request: ImageGenerationRequest,
            image: bytes,
            mask: bytes,
            email: str
    ) -> str:
        backend_request = self._build_ray_image_request(db=db, request=request, email=email)
        return self.generator.generate_inpainting_images(request=backend_request, image=image, mask=mask)

    def generate_text_with_chatbot(self, db: Session, request: TextGenerationRequest, email: str) -> str:
        backend_request = self._build_ray_text_request(db=db, request=request, email=email)
        return self.generator.generate_text_with_chatbot(request=backend_request)

    def _get_user_and_model(self, db: Session, model_name: str, email: str):
        db_user = self.user_repository.get_user_by_email(db=db, email=email)
        if not db_user:
            raise UserNotFoundError(f"user {email} does not exist in db")

        db_model = self.model_repository.get_model_by_name(db=db, model_name=model_name)
        if not db_model:
            raise ModelNotFoundError(f"model {model_name} does not exist in db")
        return db_user, db_model

    def _build_ray_image_request(
            self,
            db: Session,
            request: Union[ImageGenerationRequest],
            email: str
    ) -> ImageGenerationRequest:
        db_user, db_model = self._get_user_and_model(db=db, model_name=request.model_name, email=email)
        request_dict = {
            **request.dict(),
            "user_id": db_user.id,
            "pipeline": db_model.pipeline,
            "scheduler": request.sampler,
            "model_source": db_model.source,
        }
        backend_request = ImageGenerationRequest(**request_dict)
        return backend_request

    def _build_ray_text_request(self, db: Session, request: TextGenerationRequest, email: str) -> TextGenerationRequest:
        db_user, db_model = self._get_user_and_model(db=db, model_name=request.model_name, email=email)
        request_dict = {
            **request.dict(),
            "user_id": db_user.id,
        }

        backend_request = TextGenerationRequest(**request_dict)
        return backend_request
