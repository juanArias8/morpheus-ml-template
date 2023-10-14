from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database.database import get_db
from app.integrations.firebase_client import get_user
from app.models.schemas import User
from app.services.user_services import UserService

router = APIRouter()
user_service = UserService()


@router.post("", response_model=User)
async def load_or_create_user(user: User, db: Session = Depends(get_db)):
    new_user = await user_service.load_or_create_user(db=db, user=user)
    if not new_user:
        raise HTTPException(status_code=404, detail="User not found")
    return new_user


@router.get("/email/{email}", response_model=User)
async def get_user_data_by_email(email: str, db: Session = Depends(get_db), user=Depends(get_user)):
    request_email = user["email"]
    user = await user_service.get_user_by_email(db=db, email=email, request_email=request_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("", response_model=User)
async def update_user_data(user: User, db: Session = Depends(get_db), request_user=Depends(get_user)):
    request_email = request_user["email"]
    updated_user = await user_service.update_user(db=db, user=user, request_email=request_email)
    if not updated_user:
        return HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/{email}", response_model=Union[bool])
async def delete_user_data(email: str, db: Session = Depends(get_db), user=Depends(get_user)):
    request_email = user["email"]
    deleted_user = await user_service.delete_user(db=db, email=email, request_email=request_email)
    if not deleted_user:
        return HTTPException(status_code=404, detail="User not found")
    return {"success": True}
