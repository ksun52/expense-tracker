from fastapi import APIRouter
from app.notion.notion_connector import sync_expenses

router = APIRouter()

@router.get("/", response_model=None)
def get_all_expenses():
    """
    Sync expenses from Notion to SQLite
    """
    try:
        stats = sync_expenses()
        print(f"Sync completed successfully: {stats}")
    except Exception as e:
        print(f"Sync failed: {str(e)}")