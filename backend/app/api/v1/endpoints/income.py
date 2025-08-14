from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Income
from app.schemas import IncomeResponse

router = APIRouter()


@router.get("/", response_model=List[IncomeResponse])
def get_all_income(db: Session = Depends(get_db)):
    """
    Retrieve all income records from the database.
    """
    income_records = db.query(Income).order_by(
        Income.date_received.desc()).all()
    return income_records
