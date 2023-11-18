import logging
import uuid

import ray

from app.actors.text_models.alpaca import AlpacaTextGeneration
from app.actors.text_models.chat_glm import ChatGLMTextGeneration
from app.actors.text_models.llama2 import Llama2TextGeneration
from app.actors.text_models.magic_prompt import StableDiffusionMagicPrompt
from app.integrations.db_client import DBClient
from app.models.schemas import Generation, TextCategoryEnum, TextGenerationRequest


@ray.remote
class TextModelHandler:
    def __init__(self, *, request: TextGenerationRequest):
        self.request = request
        self.logger = logging.getLogger("ray")
        self.generator = self.get_generator().remote()

    def get_generator(self):
        generators = {
            TextCategoryEnum.MAGIC_PROMPT: StableDiffusionMagicPrompt,
            TextCategoryEnum.LLAMA2: Llama2TextGeneration,
            TextCategoryEnum.ALPACA: AlpacaTextGeneration,
            TextCategoryEnum.CHAT_GLM: ChatGLMTextGeneration,
        }
        generator = generators.get(self.request.handler)
        if generator is None:
            raise ValueError(f"Invalid handler: {self.request.handler}")
        return generator

    def handle_generation(self):
        self.logger.info(f"Generating text for: {self.request}")
        db_client = DBClient()

        try:
            # Create generation record in database
            db_client.create_generation(
                generation_id=uuid.UUID(self.request.task_id)
            )

            # Generate text with ML models
            text_future = self.generator.generate.remote(request=self.request)
            generated_text = ray.get(text_future)

            # Update generation in database
            generation = db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                results=[generated_text],
                status="COMPLETED"
            ))

            # Return image URLs
            self.logger.info(f"Generation {generation.id} updated with result: {generation.results}")
            return generation
        except Exception as e:
            self.logger.error(f"Error generating text: {e}")
            db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                status="FAILED"
            ))
            raise e
