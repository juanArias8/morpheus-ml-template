from abc import ABC
from pathlib import Path

import torch
import transformers

from app.models.schemas import TextGenerationRequest
from app.settings.settings import get_settings

settings = get_settings()


class TextGenerationAbstract(ABC):
    def __init__(
            self, *,
            model_id: str = "gpt2",
            pipeline: str = "AutoModelForCausalLM",
            tokenizer: str = "AutoTokenizer",
    ):
        # Models are saved in the models folder
        self.cache_dir = Path(settings.models_folder)

        if torch.cuda.is_available() and torch.backends.cuda.is_built():
            print("PyTorch CUDA backend is available, enabling")
            self.device = "cuda"
        elif torch.backends.mps.is_available() and torch.backends.mps.is_built():
            print("PyTorch Apple MPS backend is available, enabling")
            self.device = "mps"
        else:
            print("PyTorch is Defaulting to using CPU as a backend")
            self.device = "cpu"

        # Load the pipeline
        self.pipeline_import = getattr(transformers, pipeline)
        self.pipeline = self.pipeline_import.from_pretrained(
            pretrained_model_name_or_path=model_id,
            trust_remote_code=True,
            cache_dir=self.cache_dir,
        )
        self.pipeline.to(self.device)

        # Load the tokenizer
        self.tokenizer_import = getattr(transformers, tokenizer)
        self.tokenizer = self.tokenizer_import.from_pretrained(
            pretrained_model_name_or_path=model_id,
            trust_remote_code=True,
            cache_dir=self.cache_dir,
        )

    def generate(self, request: TextGenerationRequest):
        encoded_input = self.tokenizer(request.prompt, return_tensors='pt')
        encoded_input = encoded_input.to(self.device)
        output = self.pipeline.generate(**encoded_input)
        generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)
        torch.cuda.empty_cache()
        return generated_text
