from typing import Union

import requests
from loguru import logger

from app.config.settings import get_settings
from app.error.generation import RayCapacityExceededError
from app.models.schemas import ImageGenerationRequest, TextGenerationRequest

settings = get_settings()
RAY_BACKEND_URL = settings.ray_backend_url


def send_request_to_ray_server(
        *,
        endpoint: str,
        request: Union[TextGenerationRequest, ImageGenerationRequest],
        image: bytes = None,
        mask: bytes = None
) -> str:
    files = {}
    if image:
        files["image"] = ("image.png", image, "image/png")
    if mask:
        files["mask"] = ("mask.png", mask, "image/png")

    request_args = {
        "url": f"{RAY_BACKEND_URL}/{endpoint}",
        "params": request.__dict__,
    }
    logger.info(f"Sending request to ray server with args: {request_args}")

    if files:
        request_args["files"] = files

    try:
        can_request, pending_tasks = validate_waiting_room()
        if not can_request:
            raise RayCapacityExceededError(
                f"There is no capacity at the moment. "
                f"Please try again later. Number of pending tasks = {pending_tasks}."
            )

        response = requests.post(**request_args)
        if response.status_code == 200:
            return response.text
        else:
            raise Exception(str(response.text))
    except Exception as e:
        logger.error(f"Error while sending request to ray server: {e}")
        raise Exception(str(e))


def validate_waiting_room() -> (bool, int):
    if not settings.waiting_room_enabled:
        return True, 0

    try:
        pending_tasks = ray_pending_tasks()
        worker_number = ray_worker_number()
        worker_number = worker_number if worker_number > 0 else 1
        max_tasks = settings.max_tasks_per_worker or 10
        can_request = (pending_tasks / worker_number) < max_tasks
        return can_request, pending_tasks
    except Exception as e:
        logger.error(f"Error while validating waiting room: {e}")
        raise e


def ray_pending_tasks() -> int:
    url = f"{RAY_BACKEND_URL}/pending-tasks"
    response = requests.get(url)
    if response.status_code == 200:
        return int(response.text)
    else:
        raise Exception(str(response.text))


def ray_worker_number() -> int:
    url = f"{RAY_BACKEND_URL}/worker-number"
    response = requests.get(url)
    if response.status_code == 200:
        return int(response.text)
    else:
        raise Exception(str(response.text))


class RayAIClient:
    @staticmethod
    def generate_text2img_images(*, request: ImageGenerationRequest) -> str:
        logger.info(f"Running generate_img2img_images process with request: {request}")
        task_id = send_request_to_ray_server(endpoint="text2img", request=request)
        return str(task_id)

    @staticmethod
    def generate_img2img_images(*, request: ImageGenerationRequest, image: bytes) -> str:
        logger.info(f"Running generate_img2img_images process with request: {request}")
        task_id = send_request_to_ray_server(endpoint="img2img", request=request, image=image)
        return str(task_id)

    @staticmethod
    def generate_inpainting_images(*, request: ImageGenerationRequest, image: bytes, mask: bytes) -> str:
        logger.info(f"Running generate_inpainting_images process with request: {request}")
        task_id = send_request_to_ray_server(endpoint="inpainting", request=request, image=image, mask=mask)
        return str(task_id)

    @staticmethod
    def generate_magic_prompt(*, request: TextGenerationRequest) -> str:
        logger.info(f"Running generate_magic_prompt process with request: {request}")
        task_id = send_request_to_ray_server(endpoint="magic_prompt", request=request)
        return str(task_id)
