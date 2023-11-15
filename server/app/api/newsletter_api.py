from typing import Union

from app.config.database.database import get_db
from app.models.schemas import NewsletterRegister
from app.services.newsletter_services import NewsletterService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()
newsletter_service = NewsletterService()


@router.post("", response_model=NewsletterRegister)
async def load_or_create_user(user: NewsletterRegister, db: Session = Depends(get_db)):
    try:
        new_register = await newsletter_service.register_user(db=db, email=user.email)
        return new_register
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{email}", response_model=Union[bool])
async def delete_user_data(email: str, db: Session = Depends(get_db)):
    try:
        deleted_register = await newsletter_service.remove_user_subscription(db=db, email=email)
        return deleted_register
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
