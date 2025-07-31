from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Transactions
from app.schemas import TransactionResponse

router = APIRouter()


@router.get("/", response_model=List[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    """
    Retrieve all transactions from the database.
    """
    transactions = db.query(Transactions).order_by(
        Transactions.date.desc()).all()
    return transactions
