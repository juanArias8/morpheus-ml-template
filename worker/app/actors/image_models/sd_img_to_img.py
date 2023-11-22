import ray

from app.actors.image_models.sd_base import StableDiffusionAbstract


@ray.remote(num_gpus=1)
class StableDiffusionXLImageToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionXLImg2ImgPipeline",
            model_id="stabilityai/stable-diffusion-xl-refiner-1.0",
            scheduler=scheduler,
        )


@ray.remote(num_gpus=1)
class InstructionPix2PixImageToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionXLImg2ImgPipeline",
            model_id="timbrooks/instruct-pix2pix",
            scheduler=scheduler,
        )


@ray.remote(num_gpus=1)
class StableDiffusionV2ImageToImage(StableDiffusionAbstract):
    def __init__(self, *, scheduler: str = "DDPMScheduler"):
        super().__init__(
            pipeline="StableDiffusionImg2ImgPipeline",
            model_id="stabilityai/stable-diffusion-2-1",
            scheduler=scheduler,
        )
