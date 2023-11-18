from app.config.database.init_data.categories import chatbot

llm_models = [
    {
        "name": "ChatGLM-6B",
        "handler": "chat_glm",
        "description": "ChatGLM-6B is an open bilingual language model based on General Language Model framework.",
        "url_docs": "https://huggingface.co/THUDM/chatglm-6b",
        "source": "THUDM/chatglm3-6b",
        "pipeline": "AutoModel",
        "category": chatbot,
    },
]
