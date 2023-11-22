import logging
import uuid

import ray

from app.actors.text_models.question_answering import FalconQuestionAnswering, DistilBERTQuestionAnswering
from app.actors.text_models.text2text_generation import GoogleFlanT5, Alpaca
from app.actors.text_models.text_classification import (
    BARTClassificationNLI,
    BARTClassification,
    ToxicBERTClassification,
    RobertaClassification
)
from app.actors.text_models.text_conversational import FacebookBlenderBot, ChatGLMTextGeneration
from app.actors.text_models.text_generation import GPT2TextGeneration, Phi15TextGeneration, GPTModel, StableBeluga7B
from app.actors.text_models.text_summarization import BARTLargeCNN, DistilBARTSummarization
from app.integrations.db_client import DBClient
from app.models.schemas import Generation, TextHandlerEnum, TextGenerationRequest

generators = {
    # Question Answering
    TextHandlerEnum.QUESTION_ANSWERING_FALCON: FalconQuestionAnswering,
    TextHandlerEnum.QUESTION_ANSWERING_DISTILBERT: DistilBERTQuestionAnswering,

    # Text to Text
    TextHandlerEnum.TEXT_TO_TEXT_GOOGLE_FLAN: GoogleFlanT5,
    TextHandlerEnum.TEXT_TO_TEXT_ALCAPA: Alpaca,

    # Text Classification
    TextHandlerEnum.TEXT_CLASSIFICATION_BART_NLI: BARTClassificationNLI,
    TextHandlerEnum.TEXT_CLASSIFICATION_BART: BARTClassification,
    TextHandlerEnum.TEXT_CLASSIFICATION_TOXIC_BERT: ToxicBERTClassification,
    TextHandlerEnum.TEXT_CLASSIFICATION_ROBERTA: RobertaClassification,

    # Text Conversational
    TextHandlerEnum.TEXT_CONVERSATIONAL_BLENDERBOT: FacebookBlenderBot,
    TextHandlerEnum.TEXT_CONVERSATIONAL_CHAT_GLM: ChatGLMTextGeneration,

    # Text Generation
    TextHandlerEnum.TEXT_GENERATION_GPT2: GPT2TextGeneration,
    TextHandlerEnum.TEXT_GENERATION_PHI15: Phi15TextGeneration,
    TextHandlerEnum.TEXT_GENERATION_GPT: GPTModel,
    TextHandlerEnum.TEXT_GENERATION_STABLE_BELUGA: StableBeluga7B,

    # Text Summarization
    TextHandlerEnum.TEXT_SUMMARIZATION_BART: BARTLargeCNN,
    TextHandlerEnum.TEXT_SUMMARIZATION_DISTIL_BART: DistilBARTSummarization,
}


@ray.remote(num_cpus=1)
class TextModelHandler:
    def __init__(self, *, request: TextGenerationRequest):
        self.request = request
        self.logger = logging.getLogger("ray")
        self.generator = self.get_generator().remote()

    def get_generator(self):

        generator = generators.get(self.request.handler)
        print(f"Using handler: {self.request.handler}")
        print(f"Using generator: {generator}")
        if generator is None:
            raise ValueError(f"Invalid handler: {self.request.handler}")
        return generator

    def handle_generation(self):
        self.logger.info(f"Generating text for: {self.request}")
        db_client = DBClient()

        try:
            # Create generation record in database
            db_client.create_generation(
                generation_id=uuid.UUID(self.request.task_id)
            )

            # Generate text with ML models
            text_future = self.generator.generate.remote(request=self.request)
            generated_text = ray.get(text_future)

            # Update generation in database
            generation = db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                results=[generated_text],
                status="COMPLETED"
            ))

            # Return image URLs
            self.logger.info(f"Generation {generation.id} updated with result: {generation.results}")
            return generation
        except Exception as e:
            self.logger.error(f"Error generating text: {e}")
            db_client.update_generation(generation=Generation(
                id=self.request.task_id,
                status="FAILED"
            ))
            raise e
