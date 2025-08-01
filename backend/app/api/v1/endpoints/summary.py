from datetime import datetime
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
    db: Session = Depends(get_db)
) -> Dict[str, float]:
    """
    Get total spending by month.
    """
    try:
        # Query the database for monthly totals
        results = (
            db.query(
                extract('year', Transactions.date).label('year'),
                extract('month', Transactions.date).label('month'),
                func.sum(Transactions.amount).label('total')
            )
            .group_by('year', 'month')
            .all()
        )

        # Convert results to dictionary
        monthly_totals = {
            f"{row.year}-{row.month:02d}": float(row.total)
            for row in results
        }

        return monthly_totals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/monthly-categories")
def get_monthly_categories_summary(db: Session = Depends(get_db)):
    """
    Get total spending by category for each month.
    Returns: { category: { 'YYYY-MM': total, ... }, ... }
    """
    results = (
        db.query(
            Transactions.category,
            extract('year', Transactions.date).label('year'),
            extract('month', Transactions.date).label('month'),
            func.sum(Transactions.amount).label('total')
        )
        .group_by(Transactions.category, 'year', 'month')
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
