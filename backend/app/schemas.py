from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.core.enums import AccountType


class TransactionResponse(BaseModel):
    id: int
    notion_id: Optional[str]
    name: str
    amount: float
    date: datetime
    category: str
    sub_category: str
    method: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IncomeResponse(BaseModel):
    id: int
    notion_id: Optional[str]
    name: str
    amount: float
    date_received: datetime
    account: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AccountHistoryResponse(BaseModel):
    id: int
    account_id: int
    previous_balance: float
    amount_changed: float
    new_balance: float
    change_type: str
    related_transaction_id: Optional[int]
    related_income_id: Optional[int]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AccountResponse(BaseModel):
    id: int
    name: str
    account_type: AccountType
    current_balance: float
    created_at: datetime
    updated_at: datetime
    history: Optional[List[AccountHistoryResponse]] = []

    class Config:
        from_attributes = True


class AccountCreate(BaseModel):
    name: str
    account_type: AccountType
    initial_balance: float = 0.0
    associated_methods: Optional[str] = None


class AccountUpdate(BaseModel):
    id: int
    name: Optional[str] = None


class AccountManualAdjustment(BaseModel):
    id: int
    amount: float
    description: str
