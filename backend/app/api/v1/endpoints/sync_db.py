from fastapi import APIRouter
from app.notion.notion_connector import sync_transactions

router = APIRouter()

@router.get("/", response_model=None)
def get_all_transactions():
    """
    Sync transactions from Notion to SQLite
    """
    try:
        stats = sync_transactions()
        print(f"Sync completed successfully: {stats}")
    except Exception as e:
        print(f"Sync failed: {str(e)}")