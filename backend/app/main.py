import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from pydantic import BaseModel
from typing import List

from app.core.config import get_settings
from app.api.v1.router import api_router
from app.database.init_db import init_db
settings = get_settings()

# Initialize database
init_db()

# unsure if all these parameters are needed. Can just work with app=FastAPI()
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# TODO: add production origins (accepted frontend origins that access backend)
origins = [
    "null",                   # <-- required for file://
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    # can block specific methods or headers
    allow_headers=["*"],
)

# Include API router - mount all routes under /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Expense Tracker Application",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # python -m app.main

    # uvicorn app.main:app --reload --port 8000
