import logging
import uuid

from fastapi import FastAPI, Depends
from fastapi.responses import Response
from ray import serve
from ray.util.state import list_nodes

from app.handlers.image_model_handler import ImageModelHandler
from app.handlers.text_model_handler import TextModelHandler
from app.integrations.db_client import DBClient
from app.models.schemas import ImageGenerationRequest, TextGenerationRequest, ImageCategoryEnum, ModelRequest

app = FastAPI()


@serve.deployment(num_replicas=1, route_prefix="/")
@serve.ingress(app)
class APIIngress:
    def __init__(self) -> None:
        self.logger = logging.getLogger("ray")

    @app.get("/")
    async def root(self):
        return "Hello from Morpheus Ray"

    @app.post("/image-generation")
    async def generate_image(
            self,
            request: ImageGenerationRequest = Depends()
    ):
        try:
            self.logger.info(f"generate_image request: {request}")
            request.task_id = str(uuid.uuid4())
            handler = ImageModelHandler.remote(request=request)
            handler.handle_generation.remote()
            return Response(content=request.task_id)
        except Exception as e:
            error_str = str(e)
            self.logger.error(f"Error in generate_text2img {error_str}")
            return Response(content=error_str)

    @app.post(f"/text-generation")
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
