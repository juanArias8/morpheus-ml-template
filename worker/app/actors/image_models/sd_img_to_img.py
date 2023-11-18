import ray

from app.actors.image_models.sd_base import StableDiffusionAbstract


@ray.remote(num_gpus=1)
class StableDiffusionImageToImage(StableDiffusionAbstract):
    def __init__(
            self, *,
            pipeline: str = "StableDiffusionXLImg2ImgPipeline",
            scheduler: str = "DDPMScheduler",
            model_id: str = "stabilityai/stable-diffusion-xl-refiner-1.0"
    ):
        super().__init__(
            pipeline=pipeline,
            scheduler=scheduler,
            model_id=model_id,
        )
