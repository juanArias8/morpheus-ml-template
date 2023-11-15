from sqlalchemy.orm import Session

from app.models.models import Newsletter
from app.repository.newsletter_repository import NewsletterRepository

from app.models.schemas import NewsletterRegister


class NewsletterService:
    def __init__(self):
        self.newsletter_repository = NewsletterRepository()

    async def register_user(self, *, db: Session, email: str) -> NewsletterRegister:
        return self.newsletter_repository.register_user(db=db, email=email)

    async def remove_user_subscription(self, *, db: Session, email: str) -> bool:
        return self.newsletter_repository.remove_user_registration(db=db, email=email)
