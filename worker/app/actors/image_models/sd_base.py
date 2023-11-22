import importlib
import logging
from abc import ABC
from pathlib import Path

import torch

from app.models.schemas import ImageGenerationRequest
from app.settings.settings import get_settings

settings = get_settings()


class StableDiffusionAbstract(ABC):
    def __init__(
            self, *,
            pipeline: str = settings.default_pipeline,
            model_id: str = settings.default_model,
            scheduler: str = settings.default_scheduler,
            controlnet_id: str = None
    ):
        self.logger = logging.getLogger("ray")
        self.generator = None
        self.controlnet = None

        # Get the model source, path for local model, model_id for hugin face remote model
        self.local_model_path = Path(settings.models_folder).joinpath(model_id)
        self.model_source = self.local_model_path if Path(self.local_model_path).exists() else model_id

        # Get the controlnet source, path for local controlnet, controlnet_id for hugin face remote controlnet
        if controlnet_id is not None:
            self.local_controlnet_path = Path(settings.models_folder).joinpath(controlnet_id)
            self.controlnet_source = self.local_controlnet_path if Path(
                self.local_controlnet_path
            ).exists() else controlnet_id

        # Check the environment variable/settings file to determine if we should
        # be using 16 bit or 32 bit precision when generating images.  16 bit
        # will be faster, but 32 bit may have higher image quality.
        self.dtype = torch.float32 if settings.enable_float32 else torch.float16
        self.logger.info("Floating point precision during image generation: " + str(self.dtype))

        # Check to see if we have CUDA available via an NVidia GPU.
        if torch.cuda.is_available() and torch.backends.cuda.is_built():
            self.logger.info("PyTorch CUDA backend is available, enabling")
            self.generator_device = "cuda"
            self.enable_xformers = True
            self.device = "cuda"

        # Check to see if we have Apple Silicon's MPS Framework available and that it has
        # been compiled into this version of PyTorch.
        elif torch.backends.mps.is_available() and torch.backends.mps.is_built():
            self.logger.info("PyTorch Apple MPS backend is available, enabling")
            self.generator_device = "cpu"
            self.enable_xformers = False
            self.device = "mps"
            # With Apple M1/M2 hardware, we will always run in 32 bit precision.
            # as MPS doesn't currently support 16 bit.
            self.dtype = torch.float32

        # If neither of the CUDA or MPS are available, use the CPU instead.  This
        # will be very slow.
        else:
            self.logger.info("PyTorch is Defaulting to using CPU as a backend")
            self.generator_device = "cpu"
            self.enable_xformers = False
            self.device = "cpu"

        # Import modules and pipelines
        self.diffusers_import = importlib.import_module("diffusers")
        self.pipeline_import = getattr(self.diffusers_import, pipeline)
        self.scheduler_import = getattr(self.diffusers_import, scheduler)

        if controlnet_id is not None:
            controlnet_import = getattr(self.diffusers_import, "ControlNetModel")
            self.controlnet = controlnet_import.from_pretrained(
                self.controlnet_source,
                torch_dtype=self.dtype
            )

        # Build the pipeline parameters
        default_params = {
            "pretrained_model_name_or_path": self.model_source,
            "torch_dtype": self.dtype,
            "use_safetensors": True,
        }
        if self.controlnet:
            default_params["controlnet"] = self.controlnet

        # Load the model and scheduler
        self.pipeline = self.pipeline_import.from_pretrained(**default_params)
        self.pipeline.scheduler = self.scheduler_import.from_config(
            self.pipeline.scheduler.config,
        )
        self.pipeline.to(self.device)

        # Save the model locally if it doesn't exist
        self.save_model()
        self.save_controlnet()

        # Activate attention slicing and xformers
        self.activate_attention_slicing()
        self.activate_xformers()

    def generate(self, request: ImageGenerationRequest):
        self.logger.info(f"StableDiffusion.generate: request: {request}")
        self.set_generator(request.generator)

        # Build the pipeline parameters
        pipe_params = dict()
        pipe_params["prompt"] = request.prompt
        pipe_params["negative_prompt"] = request.negative_prompt
        pipe_params["width"] = request.width
        pipe_params["height"] = request.height
        pipe_params["num_inference_steps"] = request.num_inference_steps
        pipe_params["guidance_scale"] = request.guidance_scale
        pipe_params["num_images_per_prompt"] = request.num_images_per_prompt
        pipe_params["generator"] = self.generator

        if request.strength is not None:
            pipe_params["strength"] = request.strength
        if request.image is not None:
            pipe_params["image"] = request.image
        if request.mask is not None:
            pipe_params["mask_image"] = request.mask

        self.logger.info(pipe_params)
        result = self.pipeline(**pipe_params).images
        self.logger.info(f"StableDiffusionV2Text2Img.generate: result: {len(result)}")
        torch.cuda.empty_cache()
        return result

    def set_generator(self, generator: int):
        self.generator = torch.Generator(self.generator_device).manual_seed(generator)

    def save_model(self):
        if not Path(self.local_model_path).exists():
            self.pipeline.save_pretrained(save_directory=self.local_model_path)

    def save_controlnet(self):
        if self.controlnet and not Path(self.local_controlnet_path).exists():
            self.controlnet.save_pretrained(save_directory=self.local_controlnet_path)

    def activate_attention_slicing(self):
        if settings.enable_attention_slicing:
            self.logger.info("Attention slicing is enabled")
            self.pipeline.enable_attention_slicing()
        else:
            self.logger.info("Attention slicing is disabled")
            self.pipeline.disable_attention_slicing()

    def activate_xformers(self):
        if self.enable_xformers:
            self.logger.info("Xformers is enabled")
            self.pipeline.enable_xformers_memory_efficient_attention()
        else:
            self.logger.info("Xformers is disabled")
            self.pipeline.disable_xformers_memory_efficient_attention()
