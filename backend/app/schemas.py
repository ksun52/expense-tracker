from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class AccountTypeEnum(str, Enum):
    CASH = "cash"
    INVESTING = "investing"
    DEBT = "debt"

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
    account_type: AccountTypeEnum
    current_balance: float
    associated_methods: Optional[str]
    created_at: datetime
    updated_at: datetime
    history: Optional[List[AccountHistoryResponse]] = []

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    name: str
    account_type: AccountTypeEnum
    initial_balance: float = 0.0
    associated_methods: Optional[str] = None

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    associated_methods: Optional[str] = None

class ManualAdjustment(BaseModel):
    amount: float
    description: str 