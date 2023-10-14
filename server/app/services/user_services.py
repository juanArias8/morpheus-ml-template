from typing import List, Union

from sqlalchemy.orm import Session

from app.models.schemas import User
from app.repository.firebase_repository import FirebaseRepository
from app.repository.user_repository import UserRepository


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()
        self.firebase_repository = FirebaseRepository()

    async def load_or_create_user(self, *, db: Session, user: User) -> Union[User, None]:
        user_db = self.user_repository.get_user_by_email(db=db, email=user.email)
        if not user_db:
            user_db = self.user_repository.create_user(db=db, user=user)
            user_db = self.user_repository.get_user_data(db=db, email=user_db.email)
        return user_db

    async def get_users(self, *, db: Session, email: str) -> List[User]:
        self.user_repository.get_user_data(db=db, email=email)
        return self.user_repository.get_users(db=db)

    async def get_user_by_email(self, *, db: Session, email: str, request_email: str) -> User:
        return self.validate_user(db=db, email=email, request_email=request_email)

    async def update_user(self, *, db: Session, user: User, request_email: str) -> User:
        self.validate_user(db=db, email=user.email, request_email=request_email)
        return self.user_repository.update_user(db=db, user=user)

    async def delete_user(self, *, db: Session, email: str, request_email: str) -> bool:
        self.validate_user(db=db, email=email, request_email=request_email)
        removed_user = self.user_repository.delete_user(db=db, email=email)
        if removed_user:
            self.firebase_repository.remove_firebase_user(email=email)
        return True

    def validate_user(self, *, db: Session, email: str, request_email: str):
        if email != request_email:
            raise ValueError(f"User with email {request_email} is not the owner of the resource")
        return self.user_repository.get_user_data(db=db, email=email)
