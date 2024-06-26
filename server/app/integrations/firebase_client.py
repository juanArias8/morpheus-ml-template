from fastapi import Depends, HTTPException, status, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
from loguru import logger

from app.config.database.database import get_db
from app.config.settings import get_settings
from app.error.user import UserNotFoundError
from app.repository.user_repository import UserRepository

settings = get_settings()
user_repository = UserRepository()
db = next(get_db())

credentials = credentials.Certificate(
    {
        "type": "service_account",
        "project_id": settings.firebase_project_id,
        "private_key": settings.firebase_private_key.replace("\\n", "\n"),
        "client_email": settings.firebase_client_email,
        "token_uri": "https://oauth2.googleapis.com/token",
    }
)

initialize_app(credentials)


def validate_firebase_user(authorization: HTTPAuthorizationCredentials):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer authentication required",
            headers={"WWW-Authenticate": 'Bearer realm="auth_required"'},
        )
    try:
        decoded_token = auth.verify_id_token(authorization.credentials)
        logger.info(
            f"User {decoded_token['email']} authenticated successfully with Firebase"
        )
        return decoded_token
    except Exception as error:
        logger.error(f"Invalid authentication credentials. {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials. {error}",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )


def validate_morpheus_user(user_email: str):
    user = user_repository.get_user_by_email(db=db, email=user_email)
    if user is None:
        raise UserNotFoundError(f"User with email {user_email} not found")
    logger.info(f"User {user.email} authenticated with with Morpheus")


def get_user(
    res: Response,
    authorization: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
):
    try:
        decoded_token = validate_firebase_user(authorization=authorization)
        validate_morpheus_user(user_email=decoded_token["email"])
        res.headers["WWW-Authenticate"] = 'Bearer realm="auth_required"'
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials. {e}",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )
