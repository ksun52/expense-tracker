from datetime import datetime
from typing import Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database.session import get_db
from app.models.expenses import Expenses

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
                Expenses.category,
                func.sum(Expenses.amount).label('total')
            )
            .filter(
                extract('year', Expenses.date) == month_date.year,
                extract('month', Expenses.date) == month_date.month
            )
            .group_by(Expenses.category)
            .all()
        )
        
        # Convert results to dictionary
        category_totals = {category: float(total) for category, total in results}
        
        return category_totals
    except ValueError:
        raise ValueError("Invalid month format. Please use YYYY-MM format.") 