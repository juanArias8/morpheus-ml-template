from typing import Union, List

from loguru import logger
from sqlalchemy.orm import Session

from app.config.settings import get_settings
from app.models.models import User
from app.models.schemas import User as UserCreate

settings = get_settings()


class UserRepository:
    @classmethod
    def get_user(cls, *, db: Session, user_id: str) -> User:
        db_user = db.query(User).filter(User.id == user_id).first()
        return db_user

    @classmethod
    def get_user_by_email(cls, *, db: Session, email: str) -> User:
        user_db = db.query(User).filter(User.email == email).first()
        if user_db:
            if user_db.avatar and not user_db.avatar.startswith("https://"):
                user_db.avatar = (
                    f"https://{settings.images_bucket}.s3.amazonaws.com/{user_db.avatar}"
                )
        return user_db

    @classmethod
    def get_user_data(cls, *, db: Session, email: str) -> Union[User, None]:
        db_user = UserRepository.get_user_by_email(db=db, email=email)
        if not db_user:
            raise ValueError(f"User with email {email} not found")
        return db_user

    @classmethod
    def get_users(cls, *, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()

    @classmethod
    def create_user(cls, *, db: Session, user: UserCreate) -> User:
        db_user = UserRepository.get_user_by_email(db=db, email=user.email)
        if db_user:
            raise ValueError(f"User with email {user.email} already exists")

        logger.info(f"Creating user {user.email} with role user")
        avatar_seed = user.name if user.name else user.email
        db_user = User(
            email=user.email,
            name=user.name,
            bio=user.bio,
            avatar=f"https://ui-avatars.com/api/?name={avatar_seed}&background=random&size=128",
        )
        db.add(db_user)
        db.commit()
        return db_user

    @classmethod
    def update_user(cls, *, db: Session, user: UserCreate) -> Union[User, None]:
        db_user = UserRepository.get_user_by_email(db=db, email=user.email)
        if not db_user:
            raise ValueError(f"User with email {user.email} not found")

        db_user.name = user.name
        db_user.bio = user.bio
        db_user.avatar = user.avatar
        db.commit()
        return db_user

    @classmethod
    def delete_user(cls, *, db: Session, email: str) -> bool:
        db_user = UserRepository.get_user_by_email(db=db, email=email)
        if not db_user:
            return True

        # db_user.is_active = False  # logical deletion
        db.delete(db_user)  # Physical deletion
        db.commit()
        return True
