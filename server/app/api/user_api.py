from typing import Union

from app.config.database.database import get_db
from app.error.user import UserIsNotOwnerError, UserNotFoundError
from app.integrations.firebase_client import get_user
from app.models.schemas import User
from app.services.user_services import UserService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()
user_service = UserService()


@router.post("", response_model=User)
async def load_or_create_user(user: User, db: Session = Depends(get_db)):
    try:
        new_user = await user_service.load_or_create_user(db=db, user=user)
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/email/{email}", response_model=User)
async def get_user_data_by_email(email: str, db: Session = Depends(get_db), user=Depends(get_user)):
    try:
        request_email = user["email"]
        user = await user_service.get_user_by_email(db=db, email=email, request_email=request_email)
        return user
    except UserNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except UserIsNotOwnerError as e:
        return HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@router.put("", response_model=User)
async def update_user_data(user: User, db: Session = Depends(get_db), request_user=Depends(get_user)):
    try:
        request_email = request_user["email"]
        updated_user = await user_service.update_user(db=db, user=user, request_email=request_email)
        return updated_user
    except UserNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except UserIsNotOwnerError as e:
        return HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


@router.delete("/{email}", response_model=Union[bool])
async def delete_user_data(email: str, db: Session = Depends(get_db), user=Depends(get_user)):
    try:
        request_email = user["email"]
        await user_service.delete_user(db=db, email=email, request_email=request_email)
        return {"success": True}
    except UserNotFoundError as e:
        return HTTPException(status_code=404, detail=str(e))
    except UserIsNotOwnerError as e:
        return HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))
