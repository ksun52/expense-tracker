from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Income
from app.schemas import IncomeResponse
from app.services.income_service import separate_income_from_transactions, get_income_by_account

router = APIRouter()

@router.get("/", response_model=List[IncomeResponse])
def get_all_income(account: str = None, db: Session = Depends(get_db)):
    """
    Retrieve all income records, optionally filtered by account.
    """
    income_records = get_income_by_account(db, account)
    return income_records

@router.post("/separate")
def separate_income(db: Session = Depends(get_db)):
    """
    Process transactions to separate negative amounts into income table.
    """
    try:
        stats = separate_income_from_transactions(db)
        return {
            "message": "Income separation completed successfully",
            "stats": stats
        }
    except Exception as e:
        return {
            "message": "Income separation failed",
            "error": str(e)
        } 