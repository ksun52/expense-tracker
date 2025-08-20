from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from sqlalchemy import extract, func

from app.database.session import get_db
from app.models import Income
from app.schemas import IncomeResponse, IncomeByMonthResponse

import logging

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/", response_model=List[IncomeResponse])
def get_all_income(db: Session = Depends(get_db)):
    """
    Retrieve all income records from the database.
    """
    income_records = db.query(Income).order_by(
        Income.date_received.desc()).all()
    return income_records


@router.get("/by-month", response_model=IncomeByMonthResponse)
def get_latest_month_income(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db),
):
    """
    Retrieve the given month's total income from the database.
    """

    try:
        month_date = datetime.strptime(month, "%Y-%m")

        logger.info(f"here 1: {month_date.year} {month_date.month}")

        total = (
            db.query(
                func.sum(Income.amount))
            .filter(
                extract("year", Income.date_received) == month_date.year,
                extract("month", Income.date_received) == month_date.month,
            )
            .scalar()
        )

        return {
            "year": month_date.year,
            "month": month_date.month,
            "total": total or 0
        }

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid month format. Please use YYYY-MM format."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
