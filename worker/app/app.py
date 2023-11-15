import logging
import uuid

from fastapi import FastAPI, UploadFile, Depends
from fastapi.responses import Response
from ray import serve
from ray.util.state import list_nodes

from app.handlers.image_model_handler import ImageModelHandler
from app.handlers.text_model_handler import TextModelHandler
from app.integrations.db_client import DBClient
from app.models.schemas import ImageGenerationRequest, TextGenerationRequest, CategoryEnum, ModelRequest, \
    TextCategoryEnum

app = FastAPI()


@serve.deployment(num_replicas=1, route_prefix="/")
@serve.ingress(app)
class APIIngress:
    def __init__(self) -> None:
        self.logger = logging.getLogger("ray")
        self.task_types = [
            "PENDING_OBJ_STORE_MEM_AVAIL",
            "PENDING_NODE_ASSIGNMENT",
            "SUBMITTED_TO_WORKER",
            "PENDING_ARGS_FETCH",
            "SUBMITTED_TO_WORKER"
        ]

    @app.get("/")
    async def root(self):
        return "Hello from Morpheus Ray"

    @app.post(f"/{CategoryEnum.TEXT_TO_IMAGE}")
    async def generate_text2img(
            self,
            request: ImageGenerationRequest = Depends()
    ):
        try:
            self.logger.info(f"generate_text2img request: {request}")
            request.task_id = str(uuid.uuid4())
            model_request = ModelRequest(**request.dict())
            handler = ImageModelHandler.remote(endpoint=CategoryEnum.TEXT_TO_IMAGE, request=model_request)
            handler.handle_generation.remote()
            return Response(content=model_request.task_id)
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in generate_text2img {error_str}")
            return Response(content=error_str)

    @app.post(f"/{CategoryEnum.IMAGE_TO_IMAGE}")
    async def generate_img2img(
            self,
            image: UploadFile,
            request: ImageGenerationRequest = Depends(),
    ):
        try:
            self.logger.info(f"generate_img2img request: {request}")
            request.task_id = str(uuid.uuid4())
            model_request = ModelRequest(**request.dict())
            model_request.image = await image.read()
            handler = ImageModelHandler.remote(endpoint=CategoryEnum.IMAGE_TO_IMAGE, request=model_request)
            handler.handle_generation.remote()
            return Response(content=model_request.task_id)
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in generate_img2_img {error_str}")
            return Response(content=error_str)

    @app.post(f"/{CategoryEnum.INPAINTING}")
    async def generate_inpainting(
            self,
            image: UploadFile,
            mask: UploadFile,
            request: ImageGenerationRequest = Depends(),
    ):
        try:
            self.logger.info(f"generate_inpainting request: {request}")
            request.task_id = str(uuid.uuid4())
            model_request = ModelRequest(**request.dict())
            model_request.image = await image.read()
            model_request.mask = await mask.read()
            handler = ImageModelHandler.remote(endpoint=CategoryEnum.INPAINTING, request=model_request)
            handler.handle_generation.remote()
            return Response(content=model_request.task_id)
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in generate_inpainting {error_str}")
            return Response(content=error_str)

    @app.post(f"/text")
    async def generate_text(
            self,
            request: TextGenerationRequest = Depends(),
    ):
        try:
            self.logger.info(f"generate_text request: {request}")
            request.task_id = str(uuid.uuid4())
            handler = TextModelHandler.remote(handler=request.handler)
            handler.handle_generation.remote(request=request)
            return Response(content=request.task_id)
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in generate_text {error_str}")
            return Response(content=error_str)

    @app.get("/pending-tasks")
    async def pending_tasks(self):
        self.logger.info(f"Getting pending tasks")
        db_client = DBClient()
        pending = db_client.count_pending_generations()
        return pending

    @app.get("/worker-number")
    async def worker_number(self):
        self.logger.info(f"Getting number of workers")
        try:
            nodes = list_nodes(filters=[("state", "=", "ALIVE"), ("is_head_node", "=", "False")])
            num_workers = len(nodes)
            self.logger.info(f"Number of workers: {num_workers}")
            return num_workers
        except:
            return 1

    @app.get("/last-tasks")
    async def get_last_tasks(self):
        self.logger.info(f"Getting last tasks")
        try:
            db_client = DBClient()
            tasks = db_client.get_last_generations()
            return tasks
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in get_last_tasks {error_str}")
            return Response(content=error_str)


deployment = APIIngress.bind()
