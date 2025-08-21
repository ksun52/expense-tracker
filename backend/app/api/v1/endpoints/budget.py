from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Budget
from app.schemas import BudgetResponse, BudgetCreate, BudgetUpdate

import logging

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/", response_model=List[BudgetResponse])
def get_all_budgets(db: Session = Depends(get_db)):
    """
    Retrieve all budget records from the database.
    """
    budgets = db.query(Budget).order_by(Budget.category).all()
    return budgets


@router.get("/category", response_model=BudgetResponse)
def get_budget_by_category(category: str, db: Session = Depends(get_db)):
    """
    Retrieve a specific budget by category name.
    """
    if not category:
        raise HTTPException(
            status_code=400, detail="Category is required")
    budget = db.query(Budget).filter(Budget.category == category).first()
    if not budget:
        raise HTTPException(
            status_code=404, detail=f"Budget for category '{category}' not found")
    return budget


@router.post("/", response_model=BudgetResponse)
def create_budget(budget_data: BudgetCreate, db: Session = Depends(get_db)):
    """
    Create a new budget for a category.
    """
    # Check if budget already exists for this category
    existing_budget = db.query(Budget).filter(
        Budget.category == budget_data.category).first()
    if existing_budget:
        raise HTTPException(
            status_code=400,
            detail=f"Budget for category '{budget_data.category}' already exists"
        )

    budget = Budget(
        category=budget_data.category,
        budget_amount=budget_data.budget_amount
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    logger.info(
        f"Created budget for category '{budget_data.category}' with amount {budget_data.budget_amount}")
    return budget


@router.put("/category", response_model=BudgetResponse)
def update_budget(category: str, budget_data: BudgetUpdate, db: Session = Depends(get_db)):
    """
    Update the budget amount for a specific category.
    """
    if not category:
        raise HTTPException(
            status_code=400, detail="Category is required")
    budget = db.query(Budget).filter(Budget.category == category).first()
    if not budget:
        raise HTTPException(
            status_code=404, detail=f"Budget for category '{category}' not found")

    budget.budget_amount = budget_data.budget_amount
    db.commit()
    db.refresh(budget)

    logger.info(
        f"Updated budget for category '{category}' to amount {budget_data.budget_amount}")
    return budget


@router.delete("/category")
def delete_budget(category: str, db: Session = Depends(get_db)):
    """
    Delete a budget for a specific category.
    """
    if not category:
        raise HTTPException(
            status_code=400, detail="Category is required")
    budget = db.query(Budget).filter(Budget.category == category).first()
    if not budget:
        raise HTTPException(
            status_code=404, detail=f"Budget for category '{category}' not found")

    db.delete(budget)
    db.commit()

    logger.info(f"Deleted budget for category '{category}'")
    return {"message": f"Budget for category '{category}' deleted successfully"}


@router.post("/bulk", response_model=List[BudgetResponse])
def create_or_update_budgets_bulk(budgets_data: List[BudgetCreate], db: Session = Depends(get_db)):
    """
    Create or update multiple budgets at once.
    If a budget already exists for a category, it will be updated.
    If it doesn't exist, it will be created.
    """
    results = []

    for budget_data in budgets_data:
        existing_budget = db.query(Budget).filter(
            Budget.category == budget_data.category).first()

        if existing_budget:
            # Update existing budget
            existing_budget.budget_amount = budget_data.budget_amount
            db.commit()
            db.refresh(existing_budget)
            results.append(existing_budget)
            logger.info(
                f"Updated budget for category '{budget_data.category}' to amount {budget_data.budget_amount}")
        else:
            # Create new budget
            new_budget = Budget(
                category=budget_data.category,
                budget_amount=budget_data.budget_amount
            )
            db.add(new_budget)
            db.commit()
            db.refresh(new_budget)
            results.append(new_budget)
            logger.info(
                f"Created budget for category '{budget_data.category}' with amount {budget_data.budget_amount}")

    return results
