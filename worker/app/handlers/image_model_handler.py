import logging
import uuid

import ray

from app.actors.image_models.sd_img_to_img import StableDiffusionImageToImage
from app.actors.image_models.sd_inpainting import StableDiffusionInpainting
from app.actors.image_models.sd_text_to_img import StableDiffusionText2Img
from app.integrations.db_client import DBClient
from app.integrations.s3_client import S3Client
from app.models.schemas import ImageCategoryEnum, Generation, ModelRequest, ImageGenerationRequest


@ray.remote
class ImageModelHandler:
    def __init__(self, *, request: ImageGenerationRequest):
        self.request = request
        self.logger = logging.getLogger("ray")
        self.generator_args = {
            "pipeline": self.request.pipeline,
            "model_id": self.request.model_source,
            "scheduler": self.request.scheduler,
        }
        self.generator = self.get_generator().remote(**self.generator_args)
        self.s3_client = S3Client()

    def get_generator(self):
        generators = {
            ImageCategoryEnum.TEXT_TO_IMAGE: StableDiffusionText2Img,
            ImageCategoryEnum.IMAGE_TO_IMAGE: StableDiffusionImageToImage,
            ImageCategoryEnum.INPAINTING: StableDiffusionInpainting,
        }
        generator = generators.get(self.request.handler)
        if generator is None:
            raise ValueError(f"Invalid endpoint: {self.request.handler}")

        return generator

    def handle_generation(self):
        self.logger.info(f"Generating image for: {self.request}")
        db_client = DBClient()

        try:
            # Create generation record in database
            db_client.create_generation(
                generation_id=uuid.UUID(self.request.task_id)
            )

            # Generate images with Stable Diffusion models
            generated_images_future = self.generator.generate.remote(request=self.request)
            generated_images = ray.get(generated_images_future)

            # Upload images to S3 Bucket
            image_urls = self.s3_client.upload_multiple_files(
                files=generated_images,
                base_name=f"{self.request.user_id}/{self.request.task_id}"
            )

            # Update generation in database
            generation = db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                results=image_urls,
                status="COMPLETED"
            ))

            # Return image URLs
            self.logger.info(f"Generation {generation.id} updated with result: {generation.results}")
            return generation
        except Exception as e:
            self.logger.error(f"Error generating image: {e}")
            db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                status="FAILED"
            ))
            raise e
