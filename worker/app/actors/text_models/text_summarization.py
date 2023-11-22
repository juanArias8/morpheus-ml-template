import ray

from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest


@ray.remote(num_gpus=1)
class BARTLargeCNN(TextGenerationAbstract):
    """
    Summarization model

    Generate text with OpenChat model
    ```python
    prompt = (
        "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest "
        "structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, "
        "the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, "
        "a title it held for 41 years until the Chrysler Building in New York City was finished in 1930."
    )
    request = TextGenerationRequest(prompt=prompt)
    model = OpenChatModel()
    response = model.generate(request=request)
    print(f"OpenChat model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="facebook/bart-large-cnn",
            pipeline="AutoModelForSeq2SeqLM",
            tokenizer="AutoTokenizer",
        )


@ray.remote(num_gpus=1)
class DistilBARTSummarization(TextGenerationAbstract):
    """
    Summarization model

    Generate text with DistilBART model
    ```python
    prompt = (
        "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest "
        "structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, "
    )
    request = TextGenerationRequest(prompt=prompt)
    model = DistilBARTSummarization()
    response = model.generate(request=request)
    print(f"DistilBART model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="sshleifer/distilbart-cnn-12-6",
            pipeline="AutoModelForSeq2SeqLM",
            tokenizer="AutoTokenizer",
        )


if __name__ == "__main__":
    prompt = (
        "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest "
        "structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, "
        "the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, "
        "a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the "
        "first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of "
        "the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, "
        "the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct."
    )
    request = TextGenerationRequest(prompt=prompt)
    model = DistilBARTSummarization()
    response = model.generate(request=request)
    print(f"OpenChat model response: {response}")
