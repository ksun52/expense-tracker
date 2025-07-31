from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Income
from app.schemas import IncomeResponse
from app.services.income_service import get_income_by_account

router = APIRouter()


@router.get("/", response_model=List[IncomeResponse])
def get_all_income(account: str = None, db: Session = Depends(get_db)):
    """
    Retrieve all income records, optionally filtered by account.
    """
    income_records = get_income_by_account(db, account)
    return income_records
