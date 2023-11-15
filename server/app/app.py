import os
import time
from pathlib import Path

import sentry_sdk
from app.api.auth_api import router as AuthRouter
from app.api.generation_api import router as GenerationRouter
from app.api.models_api import router as ModelsRouter
from app.api.newsletter_api import router as NewsletterRouter
from app.api.samplers_api import router as SamplersRouter
from app.api.user_api import router as UserRouter
from app.config.database.database import engine, Base
from app.config.database.init_db import init_app_data
from app.config.logging.logger import InitLogger
from app.config.settings import get_settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

SENTRY_DSN = os.environ.get("SENTRY_DSN", "")
sentry_sdk.init(
    dsn=SENTRY_DSN,
)

app = FastAPI()
Base.metadata.create_all(bind=engine)

# Logging settings
config_path = Path("app").absolute() / "config" / "logging" / "logging.yml"
logger = InitLogger.create_logger(config_path)

# CORS settings
settings = get_settings()
ALLOWED_ORIGINS = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db():
    init_app_data()


app.include_router(AuthRouter, tags=["auth"], prefix="/auth")
app.include_router(UserRouter, tags=["users"], prefix="/users")
app.include_router(GenerationRouter, tags=["Generative AI"], prefix="/generation")
app.include_router(ModelsRouter, tags=["models"], prefix="/models")
app.include_router(SamplersRouter, tags=["samplers"], prefix="/samplers")
app.include_router(NewsletterRouter, tags=["newsletter"], prefix="/newsletter")


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": f"Welcome to morpheus, servertime {time.time()}"}
