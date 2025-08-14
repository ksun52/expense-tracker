from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database.session import get_db
from app.models import Transactions
from app.schemas import TravelResponse
from app.models import Income
from app.schemas import IncomeResponse

router = APIRouter()


@router.get("/", response_model=List[TravelResponse])
def get_travel_summary(db: Session = Depends(get_db)):
    """
    Aggregate transactions related to trips:
    - Filter transactions where name contains "trip" (case-insensitive)
    - Group by sub_category and compute:
        - total: sum of amount
        - max_date: most recent transaction date in the group
    - Sort groups by max_date descending
    """

    results = (
        db.query(
            Transactions.sub_category.label("sub_category"),
            func.sum(Transactions.amount).label("total"),
            func.max(Transactions.date).label("max_date"),
        )
        .filter(
            or_(
                Transactions.sub_category.ilike("%trip%"),
                Transactions.sub_category.ilike("%travel%")
            )
        )
        .group_by(Transactions.sub_category)
        .order_by(func.max(Transactions.date).desc())
        .all()
    )

    return results
