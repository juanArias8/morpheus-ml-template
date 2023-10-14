from fastapi import APIRouter, Depends

from app.integrations.firebase_client import get_user

router = APIRouter()


@router.get("/user", status_code=200)
async def hello_user(user=Depends(get_user)):
    return {"message": f"Hello {user['email']}"}
