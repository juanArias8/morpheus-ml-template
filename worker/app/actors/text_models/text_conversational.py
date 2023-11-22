import ray

from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest


@ray.remote(num_gpus=1)
class FacebookBlenderBot(TextGenerationAbstract):
    """
    Conversational model

    Generate text with Facebook BlenderBot
    ```python
    request = TextGenerationRequest(prompt="Hey, how are you?")
    model = FacebookBlenderBot()
    response = model.generate(request=request)
    print(f"Facebook BlenderBot response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="facebook/blenderbot-400M-distill",
            pipeline="AutoModelForSeq2SeqLM",
            tokenizer="AutoTokenizer",
        )


class ChatGLMTextGeneration(TextGenerationAbstract):
    """
    Multitask model

    Generate text with ChatGLM
    ```python
    request = TextGenerationRequest(prompt="What is python?")
    model = ChatGLMTextGeneration()
    response = model.generate(request=request)
    print(f"ChatGLM response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="THUDM/chatglm3-6b",
            pipeline="AutoModel",
            tokenizer="AutoTokenizer",
        )

    def generate(self, request: TextGenerationRequest):
        model = self.pipeline.eval()
        response, _ = model.chat(self.tokenizer, request.prompt, history=[])
        return response


if __name__ == "__main__":
    request = TextGenerationRequest(prompt="Hey, how are you?")
    model = FacebookBlenderBot()
    response = model.generate(request=request)
    print(f"Facebook BlenderBot response: {response}")
