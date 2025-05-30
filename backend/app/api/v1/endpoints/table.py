from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.expenses import Expenses
from app.schemas.expense import ExpenseResponse

router = APIRouter()

@router.get("/", response_model=List[ExpenseResponse])
def get_all_expenses(db: Session = Depends(get_db)):
    """
    Retrieve all expenses from the database.
    """
    expenses = db.query(Expenses).all()
    return expenses 