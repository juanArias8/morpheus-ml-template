from typing import Union

from app.config.settings import get_settings
from app.models.models import Newsletter
from loguru import logger
from sqlalchemy.orm import Session

settings = get_settings()


class NewsletterRepository:
    @classmethod
    def get_registration_by_email(cls, *, db: Session, email: str) -> Union[Newsletter, None]:
        return db.query(Newsletter).filter(Newsletter.email == email).first()

    @classmethod
    def register_user(cls, *, db: Session, email: str) -> Newsletter:
        db_register = NewsletterRepository.get_registration_by_email(db=db, email=email)
        if db_register:
            raise ValueError(f"User with email {email} already registered")

        logger.info(f"Registering user with email {email}")
        db_register = Newsletter(
            email=email,
        )
        db.add(db_register)
        db.commit()
        return db_register

    @classmethod
    def remove_user_registration(cls, *, db: Session, email: str) -> bool:
        db_register = NewsletterRepository.get_registration_by_email(db=db, email=email)
        if not db_register:
            return True
        db.delete(db_register)  # Physical deletion
        db.commit()
        return True
