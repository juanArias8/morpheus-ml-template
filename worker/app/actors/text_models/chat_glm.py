import logging

import ray

from app.actors.text_models.common.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest
from app.settings.settings import get_settings

settings = get_settings()


@ray.remote(num_gpus=1)
class ChatGLMTextGeneration(TextGenerationAbstract):
    def __init__(self):
        super().__init__(
            pipeline="AutoModel",
            tokenizer="AutoTokenizer",
            model_id="THUDM/chatglm3-6b",
        )
        self.logger = logging.getLogger("ray")

    def generate(self, request: TextGenerationRequest, history=None):
        self.logger.info(f"ChatGLMTextGeneration.generate: request: {request}")
        if history is None:
            history = []

        model = self.pipeline.eval()
        response, history = model.chat(self.tokenizer, request.prompt, history=history)
        return response
