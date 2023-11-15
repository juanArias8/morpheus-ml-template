from app.config.database.init_data.categories import img2img, inpainting, text2img, chatbot

ml_models = [
    {
        "name": "Stable Diffusion XL Text2Img",
        "description": "Generate images from text prompts.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "source": "stabilityai/stable-diffusion-xl-base-1.0",
        "pipeline": "StableDiffusionXLPipeline",
        "category": text2img,
    },
    {
        "name": "Stable Diffusion XL Img2Img",
        "description": "Generate images from images.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "source": "stabilityai/stable-diffusion-xl-refiner-1.0",
        "pipeline": "StableDiffusionXLImg2ImgPipeline",
        "category": img2img,
    },
    {
        "name": "Stable Diffusion XL Inpainting",
        "description": "Inpainting images.",
        "url_docs": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        "source": "stabilityai/stable-diffusion-xl-base-1.0",
        "pipeline": "StableDiffusionXLInpaintPipeline",
        "category": inpainting,
    },
    {
        "name": "ChatGLM-6B",
        "description": "ChatGLM-6B is an open bilingual language model based on General Language Model framework.",
        "url_docs": "https://huggingface.co/THUDM/chatglm-6b",
        "source": "THUDM/chatglm3-6b",
        "pipeline": "AutoModel",
        "category": chatbot,
    }
]
