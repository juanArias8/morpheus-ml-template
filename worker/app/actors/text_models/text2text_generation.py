import ray

from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest


@ray.remote(num_gpus=1)
class GoogleFlanT5(TextGenerationAbstract):
    """
    Text generation model
    - Translation
    - Question answering
    - Logical reasoning
    - Yes/No questions
    - Reasoning tasks
    - Boolean expressions
    - Math reasoning
    - Promise and agreement

    Example prompts
    - Translate to German:  My name is Arthur
    - Please answer to the following question. Who is going to be the next Ballon d'or?
    - Q: Can Geoffrey Hinton have a conversation with George Washington? Give the rationale before answering.
    - Please answer the following question. What is the boiling point of Nitrogen?
    - Answer the following yes/no question. Can you write a whole Haiku in a single tweet?
    - Answer the following yes/no question by reasoning step-by-step. Can you write a whole Haiku in a single tweet?
    - Q: ( False or not False or False ) is? A: Let's think step by step
    - The square root of x is the cube root of y. What is y to the power of 2, if x = 4?
    - Premise:  At my age you will probably have learnt one lesson. Hypothesis:  It's not certain how many lessons
    you'll learn by your thirties. Does the premise entail the hypothesis?

    Generate text with Google Flan T5
    ```python
    request = TextGenerationRequest(prompt="translate to spanish: what is python?")
    model = GoogleFlanT5()
    response = model.generate(request=request)
    print(f"Google Flan T5 response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="google/flan-t5-large",
            pipeline="T5ForConditionalGeneration",
            tokenizer="T5Tokenizer",
        )


@ray.remote(num_gpus=1)
class Alpaca(TextGenerationAbstract):
    """
    Text generation model

    Generate text with Alpaca
    ```python
    request = TextGenerationRequest(prompt="translate to spanish: what is python?")
    model = Alpaca()
    response = model.generate(request=request)
    print(f"Alpaca response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="declare-lab/flan-alpaca-large",
            pipeline="AutoModelForSeq2SeqLM",
            tokenizer="AutoTokenizer",
        )


if __name__ == "__main__":
    request = TextGenerationRequest(prompt="who was Davinci?")
    model = Alpaca()
    response = model.generate(request=request)
    print(f"Alpaca response: {response}")
