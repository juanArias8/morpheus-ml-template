from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from loguru import logger

from app.config.database.database import get_db
from app.error.model import ImageNotProvidedError, ModelNotFoundError
from app.error.user import UserNotFoundError
from app.integrations.firebase_client import get_user
from app.models.schemas import ImageGenerationRequest, TextGenerationRequest
from app.services.generation_services import GenerationServices

router = APIRouter()
generator_services = GenerationServices()


@router.post(
    "/text2img/",
    response_description="generate images from stable diffusion model by a request",
)
async def generate_text2img_images(
    request: ImageGenerationRequest = Depends(),
    db=Depends(get_db),
    user=Depends(get_user),
):
    logger.info(f"generate_text2img_images for request {request}")
    try:
        task_id = generator_services.generate_text2img_images(
            db=db, request=request, email=user["email"]
        )
        return {"task_id": task_id}
    except UserNotFoundError as e:
        return HTTPException(status_code=401, detail=str(e))
    except ModelNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        error = f"Something went wrong while generating text2img images: {str(e)}"
        return HTTPException(status_code=500, detail=error)


@router.post(
    "/img2img/",
    response_description="generate images from stable diffusion model by a request and an image.",
)
async def generate_img2img_images(
    request: ImageGenerationRequest = Depends(),
    image: UploadFile = File(...),
    db=Depends(get_db),
    user=Depends(get_user),
):
    logger.info(f"generate_img2img_images for request {request}")
    try:
        image = await image.read()
        task_id = generator_services.generate_img2img_images(
            db=db, request=request, image=image, email=user["email"]
        )
        return {"task_id": task_id}
    except UserNotFoundError as e:
        return HTTPException(status_code=401, detail=str(e))
    except ModelNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except ImageNotProvidedError as e:
        return HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error = f"Something went wrong while generating img2img images: {str(e)}"
        return HTTPException(status_code=500, detail=error)


@router.post(
    "/inpainting",
    response_description="generate images from stable diffusion model by a request, an image and a mask.",
)
async def generate_inpainting_images(
    request: ImageGenerationRequest = Depends(),
    image: UploadFile = File(...),
    mask: UploadFile = File(...),
    db=Depends(get_db),
    user=Depends(get_user),
):
    logger.info(f"generate_inpainting_images for request {request}")
    try:
        image = await image.read()
        mask = await mask.read()
        task_id = generator_services.generate_inpainting_images(
            db=db, request=request, image=image, mask=mask, email=user["email"]
        )
        return {"task_id": task_id}
    except UserNotFoundError as e:
        return HTTPException(status_code=401, detail=str(e))
    except ModelNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except ImageNotProvidedError as e:
        return HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error = f"Something went wrong while generating inpainting images: {str(e)}"
        return HTTPException(status_code=500, detail=error)


@router.post(
    "/text",
    response_description="Generate text from LLM model by a request.",
)
async def generate_text(
    request: TextGenerationRequest = Depends(),
    db=Depends(get_db),
    user=Depends(get_user),
):
    logger.info(f"generate_text request {request} and user {user['email']}")
    try:
        task_id = generator_services.generate_text_with_chatbot(
            db=db, request=request, email=user["email"]
        )
        return {"task_id": task_id}
    except UserNotFoundError as e:
        return HTTPException(status_code=401, detail=str(e))
    except ModelNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except ImageNotProvidedError as e:
        return HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error = f"Something went wrong while generating text: {str(e)}"
        return HTTPException(status_code=500, detail=error)


@router.get(
    "/results/{task_id}",
    response_description="Get image generation result by task id.",
)
async def get_generation_result(task_id, db=Depends(get_db), user=Depends(get_user)):
    try:
        logger.info(f"get_generation_result for task {task_id}")
        generation = generator_services.get_generation_result(db=db, task_id=task_id)
        return generation
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))
