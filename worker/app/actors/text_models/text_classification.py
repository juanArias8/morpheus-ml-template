import ray
from transformers import pipeline

from app.actors.text_models.text_base import TextGenerationAbstract
from app.models.schemas import TextGenerationRequest


@ray.remote(num_gpus=1)
class BARTClassificationNLI(TextGenerationAbstract):
    """
    Natural language inference model

    Generate text with BART NLI model
    ```python
    prompt = "Last week I upgraded my iOS version and ever since then my phone has been overheating."
    context = "is this a mobile app or a website problem?"
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = BARTClassificationNLI()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="facebook/bart-large-mnli",
            pipeline="AutoModelForSequenceClassification",
            tokenizer="AutoTokenizer",
        )

    def generate(self, request: TextGenerationRequest):
        input_ids = self.tokenizer.encode(request.prompt, request.context, return_tensors='pt')
        input_ids = input_ids.to(self.device)
        logits = self.pipeline(input_ids)[0]

        # we throw away "neutral" (dim 1) and take the probability of
        # "entailment" (2) as the probability of the label being true
        entail_contradiction_logits = logits[:, [0, 2]]
        probs = entail_contradiction_logits.softmax(dim=1)
        true_prob = probs[:, 1].item() * 100
        return true_prob


@ray.remote(num_gpus=1)
class BARTClassification:
    """
    Text classification model

    Generate text with BART classification model
    ```python
    prompt = "Last week I upgraded my iOS version and ever since then my phone has been overheating."
    context = "mobile, website, billing, account access"
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = BARTClassification()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
    ```
    """

    def __init__(self):
        self.pipeline = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )

    def generate(self, request: TextGenerationRequest):
        labels = request.context.split(",")
        result = self.pipeline(
            request.prompt,
            labels,
        )
        return result


@ray.remote(num_gpus=1)
class ToxicBERTClassification(TextGenerationAbstract):
    """
    Text classification model

    Generate text with BERT classification model
    ```python
    prompt = "Last week I upgraded my iOS version and ever since then my phone has been overheating."
    context = "mobile, website, billing, account access"
    request = TextGenerationRequest(prompt=prompt, context=context)
    model = ToxicBERTClassification()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
    ```
    """

    def __init__(self):
        super().__init__(
            model_id="unitary/toxic-bert",
            pipeline="AutoModelForSequenceClassification",
            tokenizer="AutoTokenizer",
        )

    def generate(self, request: TextGenerationRequest):
        input_ids = self.tokenizer.encode(request.prompt, request.context, return_tensors='pt')
        input_ids = input_ids.to(self.device)
        logits = self.pipeline(input_ids)[0]
        probs = logits.softmax(dim=1).tolist()[0]
        labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
        probs = {label: prob * 100 for label, prob in zip(labels, probs)}
        return probs


@ray.remote(num_gpus=1)
class RobertaClassification:
    """
    Text emotions classification model

    Text classification with Roberta classification model
    ```python
    prompt = "I am not having a great day."
    request = TextGenerationRequest(prompt=prompt)
    model = RobertaClassification()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
    ```
    """

    def __init__(self):
        self.pipeline = pipeline(
            "text-classification",
            model="SamLowe/roberta-base-go_emotions",
            top_k=None
        )

    def generate(self, request: TextGenerationRequest):
        outputs = self.pipeline(request.prompt)
        return outputs[0]


if __name__ == "__main__":
    # Create request object with prompt
    prompt = "I am not having a great day."
    request = TextGenerationRequest(prompt=prompt)

    # Generate text with OpenChat model
    model = RobertaClassification()
    response = model.generate(request=request)
    print(f"Text model response: {response}")
