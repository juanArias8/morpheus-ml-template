import ray

from app.actors.image_models.sd_base import StableDiffusionAbstract


@ray.remote(num_gpus=1)
class StableDiffusionXLInpainting(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionXLInpaintPipeline",
            model_id="stabilityai/stable-diffusion-xl-base-1.0",
            scheduler=scheduler
        )


@ray.remote(num_gpus=1)
class RunwayStableDiffusionInpainting(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionInpaintPipeline",
            model_id="runwayml/stable-diffusion-inpainting",
            scheduler=scheduler
        )


@ray.remote(num_gpus=1)
class StableDiffusionV2Inpainting(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionInpaintPipeline",
            model_id="stabilityai/stable-diffusion-2-inpainting",
            scheduler=scheduler
        )
