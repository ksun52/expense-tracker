from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models import Account, AccountHistory
from app.schemas import (
    AccountResponse, AccountCreate, AccountUpdate, AccountManualAdjustment,
    AccountHistoryResponse
)
from app.services.account_service import AccountService

router = APIRouter()


@router.get("/", response_model=List[AccountResponse])
def get_all_accounts(db: Session = Depends(get_db)):
    """Get all accounts with their current balances."""
    service = AccountService(db)
    accounts = service.get_all_accounts()
    return accounts


@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: int, db: Session = Depends(get_db)):
    """Get a specific account by ID."""
    service = AccountService(db)
    account = service.get_account_by_id(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.post("/", response_model=AccountResponse)
def create_account(account_data: AccountCreate, db: Session = Depends(get_db)):
    """Create a new account."""
    service = AccountService(db)
    try:
        account = service.create_account(account_data)
        return account
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{account_id}", response_model=AccountResponse)
def update_account(account_id: int, account_data: AccountUpdate, db: Session = Depends(get_db)):
    """Update account details (not balance)."""
    service = AccountService(db)
    account = service.update_account(account_id, account_data)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.post("/{account_id}/adjust", response_model=AccountResponse)
def manual_adjustment(account_id: int, adjustment: AccountManualAdjustment, db: Session = Depends(get_db)):
    """Manually adjust account balance."""
    service = AccountService(db)
    account = service.manual_adjustment(account_id, adjustment)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.post("/transfer")
def transfer_money(
    from_account_id: int,
    to_account_id: int,
    amount: float,
    description: str = None,
    db: Session = Depends(get_db)
):
    """Transfer money between accounts."""
    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="Transfer amount must be positive")

    service = AccountService(db)
    success = service.transfer_between_accounts(
        from_account_id, to_account_id, amount, description)

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Transfer failed. Check account IDs and sufficient balance."
        )

    return {
        "message": "Transfer completed successfully",
        "from_account_id": from_account_id,
        "to_account_id": to_account_id,
        "amount": amount
    }


@router.get("/{account_id}/history", response_model=List[AccountHistoryResponse])
def get_account_history(account_id: int, db: Session = Depends(get_db)):
    """Get account history."""
    service = AccountService(db)
    account = service.get_account_by_id(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    history = db.query(AccountHistory).filter(
        AccountHistory.account_id == account_id
    ).order_by(AccountHistory.created_at.desc()).all()

    return history


@router.post("/sync-balances")
def sync_account_balances(db: Session = Depends(get_db)):
    """Sync all account balances based on existing transactions and income."""
    service = AccountService(db)

    try:
        # This would be a more complex operation that recalculates all balances
        # For now, we'll return a placeholder
        return {
            "message": "Balance sync functionality will be implemented in next step",
            "note": "This will recalculate all account balances from transaction history"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
