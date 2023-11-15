import logging

import ray
import torch
import transformers
from transformers import AutoTokenizer

from app.models.schemas import TextGenerationRequest
from app.settings.settings import get_settings

settings = get_settings()


@ray.remote(num_gpus=1)
class Llama2TextGeneration:
    def __init__(self):
        from huggingface_hub.hf_api import HfFolder

        HfFolder.save_token(settings.hf_api_key)
        self.logger = logging.getLogger("ray")
        self.model = "meta-llama/Llama-2-7b-chat-hf"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model)
        self.pipeline = transformers.pipeline(
            "text-generation",
            model=self.model,
            torch_dtype=torch.float16,
            device_map="auto",
            token=settings.hf_api_key,
        )

    def generate(self, request: TextGenerationRequest):
        self.logger.info(f"StableDiffusionMagicPrompt.generate: request: {request}")
        sequences = self.pipeline(
            request.prompt,
            do_sample=True,
            top_k=10,
            num_return_sequences=1,
            eos_token_id=self.tokenizer.eos_token_id,
            max_length=200,
        )
        results = [seq["generated_text"] for seq in sequences]
        return results
