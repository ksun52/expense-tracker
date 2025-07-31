from sqlalchemy.orm import Session
from app.models import Transactions, Income
from datetime import datetime, UTC


def get_income_by_account(db: Session, account: str = None) -> list:
    """
    Get income records, optionally filtered by account.
    """
    query = db.query(Income)
    if account:
        query = query.filter(Income.account == account)

    return query.order_by(Income.date_received.desc()).all()
