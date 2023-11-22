from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest

import ray


@ray.remote(num_gpus=1)
class GPT2TextGeneration(TextGenerationAbstract):
    """
    Text generation model

    Generate text with GPT2
    ```python
    request = TextGenerationRequest(prompt="once upon a time")
    model = GPT2TextGeneration()
    response = model.generate(request=request)
    print(f"GPT2 response: {response}")
    ```
    """
    pass


@ray.remote(num_gpus=1)
class Phi15TextGeneration(TextGenerationAbstract):
    """
    Text generation model

    Generate text with Phi-1.5
    ```python
    request = TextGenerationRequest(prompt="once upon a time")
    model = Phi15TextGeneration()
    response = model.generate(request=request)
    print(f"Phi-1.5 response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="microsoft/phi-1_5",
            pipeline="AutoModelForCausalLM",
            tokenizer="AutoTokenizer",
        )


@ray.remote(num_gpus=1)
class GPTModel(TextGenerationAbstract):
    """
    Text generation model

    Generate text with GPT model
    ```python
    request = TextGenerationRequest(prompt="once upon a time")
    model = GPTModel()
    response = model.generate(request=request)
    print(f"GPT model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="openai-gpt",
            pipeline="AutoModelForCausalLM",
            tokenizer="AutoTokenizer",
        )


@ray.remote(num_gpus=1)
class StableBeluga7B(TextGenerationAbstract):
    """
    Text generation model

    Generate text with Stable Beluga 7B
    ```python
    request = TextGenerationRequest(prompt="translate to spanish: what is python?")
    model = StableBeluga7B()
    response = model.generate(request=request)
    print(f"Stable Beluga 7B response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="stabilityai/StableBeluga-7B",
            pipeline="AutoModelForCausalLM",
            tokenizer="AutoTokenizer",
        )


if __name__ == "__main__":
    # Create request object with prompt
    prompt = "write a poem about Morpheus"
    request = TextGenerationRequest(prompt=prompt)

    # Generate text with OpenChat model
    model = StableBeluga7B()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
