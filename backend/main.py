from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
from database import get_db, engine
from notion_connector import get_expenses
from datetime import datetime

app = FastAPI(title="Expense Tracker API")

# Create database tables
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracker API"}

@app.get("/sync")
def sync_expenses(db: Session = Depends(get_db)):
    """Sync expenses from Notion to SQLite database."""
    try:
        # Get expenses from Notion
        notion_expenses = get_expenses()
        
        # Track how many expenses were synced
        synced_count = 0
        
        for expense_data in notion_expenses:
            # Check if expense already exists
            existing_expense = db.query(models.Expense).filter(
                models.Expense.notion_id == expense_data["notion_id"]
            ).first()
            
            if existing_expense:
                # Update existing expense
                for key, value in expense_data.items():
                    setattr(existing_expense, key, value)
            else:
                # Create new expense
                new_expense = models.Expense(**expense_data)
                db.add(new_expense)
            
            synced_count += 1
        
        db.commit()
        return {"message": f"Successfully synced {synced_count} expenses"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses", response_model=List[models.Expense])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all expenses from the database."""
    expenses = db.query(models.Expense).offset(skip).limit(limit).all()
    return expenses 