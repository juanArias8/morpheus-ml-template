import ray

from app.actors.image_models.sd_base import StableDiffusionAbstract


@ray.remote(num_gpus=1)
class StableDiffusionXLText2Img(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionXLPipeline",
            model_id="stabilityai/stable-diffusion-xl-base-1.0",
            scheduler=scheduler
        )


@ray.remote(num_gpus=1)
class StableDiffusionRunwayTextToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionPipeline",
            model_id="runwayml/stable-diffusion-v1-5",
            scheduler=scheduler
        )


@ray.remote(num_gpus=1)
class StableDiffusionV2TextToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionPipeline",
            model_id="stabilityai/stable-diffusion-2-1",
            scheduler=scheduler
        )


@ray.remote(num_gpus=1)
class OpenjourneyTextToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionPipeline",
            model_id="prompthero/openjourney-v4",
            scheduler=scheduler
        )
