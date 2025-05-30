from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import os
class Settings(BaseSettings):
    PROJECT_NAME: str = "Finance Tracker"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Directory paths
    CORE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    APP_DIR: str = os.path.dirname(CORE_DIR)
    DATABASE_DIR: str = os.path.join(APP_DIR, 'database')

    # Database configuration
    DATABASE_URL: str = f"sqlite:///{os.path.join(DATABASE_DIR, 'finances.db')}"

    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 