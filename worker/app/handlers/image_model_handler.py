import logging
import uuid

import ray

from app.actors.image_models.sd_img_to_img import (
    StableDiffusionXLImageToImage,
    StableDiffusionV2ImageToImage,
    InstructionPix2PixImageToImage
)
from app.actors.image_models.sd_inpainting import (
    StableDiffusionXLInpainting,
    RunwayStableDiffusionInpainting,
    StableDiffusionV2Inpainting
)
from app.actors.image_models.sd_text_to_img import (
    StableDiffusionXLText2Img,
    StableDiffusionRunwayTextToImage,
    StableDiffusionV2TextToImage,
    OpenjourneyTextToImage
)
from app.integrations.db_client import DBClient
from app.integrations.s3_client import S3Client
from app.models.schemas import ImageHandlerEnum, Generation, ImageGenerationRequest

generators = {
    # Text to Image
    ImageHandlerEnum.TEXT_TO_IMAGE_SDXL: StableDiffusionXLText2Img,
    ImageHandlerEnum.TEXT_TO_IMAGE_RUNWAY: StableDiffusionRunwayTextToImage,
    ImageHandlerEnum.TEXT_TO_IMAGE_SDV2: StableDiffusionV2TextToImage,
    ImageHandlerEnum.TEXT_TO_IMAGE_OPENJOURNEY: OpenjourneyTextToImage,

    # Image to Image
    ImageHandlerEnum.IMAGE_TO_IMAGE_SDXL: StableDiffusionXLImageToImage,
    ImageHandlerEnum.IMAGE_TO_IMAGE_PIX2PIX: InstructionPix2PixImageToImage,
    ImageHandlerEnum.IMAGE_TO_IMAGE_SDV2: StableDiffusionV2ImageToImage,

    # Inpainting
    ImageHandlerEnum.INPAINTING_SDXL: StableDiffusionXLInpainting,
    ImageHandlerEnum.INPAINTING_RUNWAY: RunwayStableDiffusionInpainting,
    ImageHandlerEnum.INPAINTING_SDV2: StableDiffusionV2Inpainting,
}


@ray.remote(num_cpus=1)
class ImageModelHandler:
    def __init__(self, *, request: ImageGenerationRequest):
        self.request = request
        self.logger = logging.getLogger("ray")
        self.generator_args = {
            "scheduler": self.request.scheduler,
        }
        self.generator = self.get_generator().remote(scheduler=self.request.scheduler)
        self.s3_client = S3Client()

    def get_generator(self):
        generator = generators.get(self.request.handler)
        self.logger.info(f"Using handler: {self.request.handler}")
        self.logger.info(f"Using generator: {generator}")
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
