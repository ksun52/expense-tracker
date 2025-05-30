from fastapi import APIRouter
from app.notion.notion_connector import sync_expenses
from typing import Dict

router = APIRouter()

@router.get("/", response_model=Dict)
def sync_notion():
    """
    Sync expenses from Notion to SQLite
    """
    try:
        stats = sync_expenses()
        return stats
    except Exception as e:
        raise Exception(f"Sync failed: {str(e)}")