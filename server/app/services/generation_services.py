from sqlalchemy.orm import Session

from app.error.generation import GenerationNotFoundError
from app.error.model import ModelNotFoundError
from app.integrations.ray_ai_client import RayAIClient
from app.models.schemas import ImageGenerationRequest
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
        backend_request = self._build_backend_request(db=db, request=request, email=email)
        return self.generator.generate_text2img_images(request=backend_request)

    def generate_img2img_images(self, db: Session, request: ImageGenerationRequest, image: bytes, email: str) -> str:
        backend_request = self._build_backend_request(db=db, request=request, email=email)
        return self.generator.generate_img2img_images(request=backend_request, image=image)

    def generate_inpainting_images(self, db: Session, request: ImageGenerationRequest, image: bytes, mask: bytes,
                                   email: str) -> str:
        backend_request = self._build_backend_request(db=db, request=request, email=email)
        return self.generator.generate_inpainting_images(request=backend_request, image=image, mask=mask)

    def _validate_request(self, db: Session, model: str = None) -> None:
        db_model = self.model_repository.get_model_by_name(db=db, model_source=model)
        if not db_model:
            raise ModelNotFoundError(f"model {model} does not exist in db")

    def _build_backend_request(
            self,
            db: Session,
            request: ImageGenerationRequest,
            email: str
    ) -> ImageGenerationRequest:
        self._validate_request(db=db, model=request.model_id)
        pipeline = hasattr(request, "pipeline") and request.pipeline or "StableDiffusionPipeline"
        request_dict = {
            **request.dict(),
            "user_id": email,
            "pipeline": pipeline,
            "sampler": request.sampler,
            "model_id": request.model_id,
        }

        backend_request = ImageGenerationRequest(**request_dict)
        return backend_request
