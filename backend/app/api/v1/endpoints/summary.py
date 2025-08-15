from datetime import date
from dateutil.relativedelta import relativedelta

from typing import Dict
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database.session import get_db
from app.models import Transactions

router = APIRouter()


@router.get("/categories")
def get_category_summary(
    month: str = Query(..., description="Month in YYYY-MM format"),
    db: Session = Depends(get_db)
) -> Dict[str, float]:
    """
    Get total spending by category for a specific month.
    """
    try:
        # Parse the month string
        month_date = datetime.strptime(month, "%Y-%m")

        # Query the database for category totals
        results = (
            db.query(
                Transactions.category,
                func.sum(Transactions.amount).label('total')
            )
            .filter(
                extract('year', Transactions.date) == month_date.year,
                extract('month', Transactions.date) == month_date.month
            )
            .group_by(Transactions.category)
            .all()
        )

        # Convert results to dictionary
        category_totals = {category: float(total)
                           for category, total in results}

        return category_totals
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid month format. Please use YYYY-MM format.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/monthly")
def get_monthly_summary(
    months: int = Query(None, description="Number of months to include"),
    db: Session = Depends(get_db)
) -> Dict[str, float]:
    """
    Get total spending by month optionally limited to the past N months.
    Past N months = current month + previous (N-1) full months.
    """
    try:
        query = db.query(
            extract('year', Transactions.date).label('year'),
            extract('month', Transactions.date).label('month'),
            func.sum(Transactions.amount).label('total')
        )

        if months:
            # Start date = first day of (months-1) months ago
            start_date = (date.today().replace(day=1) -
                          relativedelta(months=months - 1))
            query = query.filter(Transactions.date >= start_date)

        results = (
            query
            .group_by('year', 'month')
            .order_by('year', 'month')
            .all()
        )

        monthly_totals = {
            f"{int(row.year)}-{int(row.month):02d}": float(row.total)
            for row in results
        }

        return monthly_totals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/monthly-categories")
def get_monthly_categories_summary(
    months: int = Query(None, description="Number of months to include"),
    db: Session = Depends(get_db)
):
    """
    Get total spending by category for each month.
    Returns: { category: { 'YYYY-MM': total, ... }, ... }
    """
    query = db.query(
        Transactions.category,
        extract('year', Transactions.date).label('year'),
        extract('month', Transactions.date).label('month'),
        func.sum(Transactions.amount).label('total')
    )

    if months:
        start_date = (date.today().replace(day=1) -
                      relativedelta(months=months - 1))
        query = query.filter(Transactions.date >= start_date)

    results = (
        query
        .group_by(Transactions.category, 'year', 'month')
        .order_by('year', 'month')
        .all()
    )

    summary = {}
    for category, year, month, total in results:
        if not category:
            continue
        key = f"{int(year):04d}-{int(month):02d}"
        if category not in summary:
            summary[category] = {}
        summary[category][key] = float(total)
    return summary
