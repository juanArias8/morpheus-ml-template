from functools import lru_cache

from pydantic import PostgresDsn, BaseSettings


class Settings(BaseSettings):
    # PostgreSQL database config
    postgres_user: str = "postgres"
    postgres_password: str = "password"
    postgres_host: str = "postgres"
    postgres_port: str = "5432"
    postgres_db: str = "morpheus"

    # backend config
    allowed_origins: str = "http://localhost:3000"
    ray_backend_url: str = "http://worker-ray:8000"
    waiting_room_enabled: bool = True
    max_tasks_per_worker: int = 8

    # Auth config
    firebase_project_id: str
    firebase_private_key: str
    firebase_client_email: str
    firebase_web_api_key: str

    # AWS and s3 config
    aws_access_key_id: str
    aws_secret_access_key: str
    results_bucket: str
    images_bucket: str = "morpheus-images"

    class Config:
        env_file = "secrets.env"

    def get_db_url(self) -> str:
        return PostgresDsn.build(
            scheme="postgresql",
            user=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            path=f"/{self.postgres_db}",
        )


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    return settings
