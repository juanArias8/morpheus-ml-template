from app.config.database.init_data.categories import (
    img2img,
    inpainting,
    text2img,
)

diffusion_models = [
    {
        "name": "Stable Diffusion XL Text2Img",
        "handler": "text2img-sdxl",
        "description": "Generate images from text prompts.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "category": text2img,
    },
    {
        "name": "Runway ML Stable Diffusion v1.5",
        "handler": "text2img-runway",
        "description": "Generate images from text prompts.",
        "url_docs": "https://huggingface.co/runwayml/stable-diffusion-v1-5",
        "category": text2img,
    },
    {
        "name": "Stable Diffusion v2",
        "handler": "text2img-sdv2",
        "description": "Generate images from text prompts.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-2-1",
        "category": text2img,
    },
    {
        "name": "Openjourney",
        "handler": "text2img-openjourney",
        "description": "Generate images from text prompts.",
        "url_docs": "https://huggingface.co/prompthero/openjourney",
        "category": text2img,
    },
    {
        "name": "Stable Diffusion XL Img2Img",
        "handler": "img2img-sdxl",
        "description": "Generate images from images.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "category": img2img,
    },
    {
        "name": "InstructPix2Pix",
        "handler": "img2img-pix2pix",
        "description": "Generate images from images.",
        "url_docs": "https://huggingface.co/timbrooks/instruct-pix2pix",
        "category": img2img,
    },
    {
        "name": "Stable Diffusion v2",
        "handler": "img2img-sdv2",
        "description": "Generate images from images.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-2",
        "category": img2img,
    },
    {
        "name": "Stable Diffusion XL Inpainting",
        "handler": "inpainting-sdxl",
        "description": "Inpainting  lets you edit specific parts of an image by providing a mask and a text prompt.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "category": inpainting,
    },
    {
        "name": "Runway ML Stable Diffusion Inpainting",
        "handler": "inpainting-runway",
        "description": "Inpainting  lets you edit specific parts of an image by providing a mask and a text prompt.",
        "url_docs": "https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/inpaint",
        "category": inpainting,
    },
    {
        "name": "Stable Diffusion v2 Inpainting",
        "handler": "inpainting-sdv2",
        "description": "Inpainting  lets you edit specific parts of an image by providing a mask and a text prompt.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-2-inpainting",
        "category": inpainting,
    },
]
