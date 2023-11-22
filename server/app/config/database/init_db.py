from loguru import logger

from app.config.database.database import get_db
from app.config.database.init_data.categories import all_categories
from app.config.database.init_data.diffusion_models import diffusion_models
from app.config.database.init_data.llm_models import llm_models
from app.config.database.init_data.samplers import samplers
from app.config.database.init_data.users import morpheus_user
from app.models.schemas import ModelCategory, User, MLModel, Sampler
from app.repository.category_repository import ModelCategoryRepository
from app.repository.firebase_repository import FirebaseRepository
from app.repository.model_repository import ModelRepository
from app.repository.sampler_repository import SamplerRepository
from app.repository.user_repository import UserRepository

db = next(get_db())

user_repository = UserRepository()
firebase_repository = FirebaseRepository()
categories_repository = ModelCategoryRepository()
model_repository = ModelRepository()
sampler_repository = SamplerRepository()


def init_users():
    user_email = morpheus_user.get("email", None)
    db_user = user_repository.get_user_by_email(db=db, email=user_email)
    if not db_user:
        user_repository.create_user(db=db, user=User(**morpheus_user))
    logger.info(f"Morpheus user {user_email} created")


def init_categories():
    for category in all_categories:
        category_key = category.get("key", None)
        category_name = category.get("name", None)
        db_category = categories_repository.get_category_by_key(db=db, key=category_key)
        if not db_category:
            categories_repository.create_category(
                db=db, category=ModelCategory(**category)
            )
        logger.info(f"Category {category_name} created")


def init_samplers():
    for sampler in samplers:
        sampler_key = sampler.get("key", None)
        db_sampler = sampler_repository.get_sampler_by_key(
            db=db, sampler_key=sampler_key
        )
        if not db_sampler:
            sampler_repository.create_sampler(db=db, sampler=Sampler(**sampler))
        logger.info(f"Sampler {sampler_key} created")


def init_models():
    all_models = diffusion_models + llm_models
    for model in all_models:
        model_handler = model.get("handler", None)
        model_name = model.get("name", None)
        db_model = model_repository.get_model_by_handler(db=db, handler=model_handler)

        if not db_model:
            category = model.get("category", None)
            if not category:
                pass

            category_key = category.get("key", None)
            db_category = categories_repository.get_category_by_key(
                db=db, key=category_key
            )
            print("---------------------------------------------")
            print(db_category)
            print(MLModel(**model))
            print("---------------------------------------------")
            model_repository.create_model(
                db=db, model=MLModel(**model), category=db_category
            )
        logger.info(f"Model {model_name} created")


def init_app_data():
    init_users()
    init_categories()
    init_samplers()
    init_models()
    db.close()


if __name__ == "__main__":
    init_app_data()
