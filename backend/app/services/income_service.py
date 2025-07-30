from sqlalchemy.orm import Session
from app.models import Transactions, Income
from datetime import datetime, UTC

def separate_income_from_transactions(db: Session) -> dict:
    """
    Process transactions to separate negative amounts into income table.
    Returns statistics about the operation.
    """
    stats = {
        "transactions_processed": 0,
        "income_records_created": 0,
        "transactions_converted": 0
    }
    
    # Find transactions with negative amounts that haven't been processed yet
    negative_transactions = db.query(Transactions).filter(
        Transactions.amount < 0
    ).all()
    
    stats["transactions_processed"] = len(negative_transactions)
    
    for transaction in negative_transactions:
        # Check if income record already exists for this notion_id
        existing_income = None
        if transaction.notion_id:
            existing_income = db.query(Income).filter(
                Income.notion_id == transaction.notion_id
            ).first()
        
        if not existing_income:
            # Create new income record
            income_record = Income(
                notion_id=transaction.notion_id,
                name=transaction.name,
                amount=abs(transaction.amount),  # Convert to positive
                date_received=transaction.date,
                account="Checking Account"  # Default account, can be updated later
            )
            
            db.add(income_record)
            stats["income_records_created"] += 1
            
            # Remove the negative transaction since it's now an income record
            db.delete(transaction)
            stats["transactions_converted"] += 1
    
    db.commit()
    return stats

def get_income_by_account(db: Session, account: str = None) -> list:
    """
    Get income records, optionally filtered by account.
    """
    query = db.query(Income)
    if account:
        query = query.filter(Income.account == account)
    
    return query.order_by(Income.date_received.desc()).all() 