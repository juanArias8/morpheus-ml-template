import ray

from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest


class QuestionAnsweringBase(TextGenerationAbstract):
    def __init__(
            self, *,
            model_id: str,
            pipeline: str,
            tokenizer: str,
    ):
        super().__init__(
            model_id=model_id,
            pipeline=pipeline,
            tokenizer=tokenizer,
        )

    def generate(self, request: TextGenerationRequest):
        inputs = self.tokenizer(request.prompt, request.context, return_tensors="pt")
        encoded_input = inputs.to(self.device)
        outputs = self.pipeline(**encoded_input)
        answer_start_index = outputs.start_logits.argmax()
        answer_end_index = outputs.end_logits.argmax()
        predict_answer_tokens = inputs.input_ids[0, answer_start_index: answer_end_index + 1]
        response = self.tokenizer.decode(predict_answer_tokens)
        return response


@ray.remote(num_gpus=1)
class FalconQuestionAnswering(QuestionAnsweringBase):
    """
    Question answering model

    Generate answer with Falcon Question Answering model
    ```python
    prompt = "On which date did Swansea City play its first Premier League game??"
    context = "In 2011, a Welsh club participated in the Premier League for the first time after Swansea City gained promotion. The first Premier League match to be played outside England was Swansea City's home match at the Liberty Stadium against Wigan Athletic on 20 August 2011. In 2012\u201313, Swansea qualified for the Europa League by winning the League Cup. The number of Welsh clubs in the Premier League increased to two for the first time in 2013\u201314, as Cardiff City gained promotion, but Cardiff City was relegated after its maiden season."
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = FalconQuestionAnswering()
    response = model.generate(request=request)
    print(f"Falcon Question Answering model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="Falconsai/question_answering_v2",
            pipeline="AutoModelForQuestionAnswering",
            tokenizer="AutoTokenizer",
        )


@ray.remote(num_gpus=1)
class DistilBERTQuestionAnswering(QuestionAnsweringBase):
    """
    Question answering model

    Generate answer with DistilBERT Question Answering model
    ```python
    prompt = "On which date did Swansea City play its first Premier League game??"
    context = (
        "In 2011, a Welsh club participated in the Premier League for the first time after Swansea City gained "
        "promotion. The first Premier League match to be played outside England was Swansea City's home match at "
        "the Liberty Stadium against Wigan Athletic on 20 August 2011. In 2012\u201313, Swansea qualified for the "
        "Europa League by winning the League Cup. The number of Welsh clubs in the Premier League increased to "
        "two for the first time in 2013\u201314, as Cardiff City gained promotion, but Cardiff City was relegated "
        "after its maiden season."
    )
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = DistilBERTQuestionAnswering()
    response = model.generate(request=request)
    print(f"Model response: {response}")
    """

    def __init__(self):
        super().__init__(
            model_id="distilbert-base-uncased-distilled-squad",
            pipeline="AutoModelForQuestionAnswering",
            tokenizer="AutoTokenizer",
        )


if __name__ == "__main__":
    prompt = "On which date did Swansea City play its first Premier League game??"
    context = (
        "In 2011, a Welsh club participated in the Premier League for the first time after Swansea City gained "
        "promotion. The first Premier League match to be played outside England was Swansea City's home match at "
        "the Liberty Stadium against Wigan Athletic on 20 August 2011. In 2012\u201313, Swansea qualified for the "
        "Europa League by winning the League Cup. The number of Welsh clubs in the Premier League increased to "
        "two for the first time in 2013\u201314, as Cardiff City gained promotion, but Cardiff City was relegated "
        "after its maiden season."
    )
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = DistilBERTQuestionAnswering()
    response = model.generate(request=request)
    print(f"Model response: {response}")
