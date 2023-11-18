import ray

from app.actors.image_models.sd_base import StableDiffusionAbstract


@ray.remote(num_gpus=1)
class StableDiffusionText2Img(StableDiffusionAbstract):
    def __init__(
            self, *,
            pipeline: str = "StableDiffusionXLPipeline",
            model_id: str = "stabilityai/stable-diffusion-xl-base-1.0",
            scheduler: str = "DDPMScheduler",
    ):
        super().__init__(
            pipeline=pipeline,
            model_id=model_id,
            scheduler=scheduler
        )
