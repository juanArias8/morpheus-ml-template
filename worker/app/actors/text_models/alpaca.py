import logging

import ray
from transformers import pipeline

from app.models.schemas import TextGenerationRequest
from app.settings.settings import get_settings

settings = get_settings()


@ray.remote(num_gpus=1)
class AlpacaTextGeneration:
    def __init__(self):
        self.logger = logging.getLogger("ray")
        self.model = "declare-lab/flan-alpaca-gpt4-xl"
        self.pipeline = pipeline(
            "text-generation",
            model=self.model,
        )

    def generate(self, request: TextGenerationRequest):
        self.logger.info(f"AlpacaTextGeneration.generate: request: {request}")
        sequences = self.pipeline(
            request.prompt,
            do_sample=True,
            top_k=10,
            num_return_sequences=1,
            max_length=512,
        )
        results = [seq["generated_text"] for seq in sequences]
        return results
