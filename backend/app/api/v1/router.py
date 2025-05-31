from fastapi import APIRouter
from app.api.v1.endpoints import table, sync_db, summary

api_router = APIRouter()

api_router.include_router(table.router, prefix="/table", tags=["table"]) 
api_router.include_router(sync_db.router, prefix="/sync", tags=["sync"])
api_router.include_router(summary.router, prefix="/summary", tags=["summary"])