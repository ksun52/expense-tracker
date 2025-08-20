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


class IncomeByMonthResponse(BaseModel):
    year: int
    month: int
    total: float


class TravelResponse(BaseModel):
    sub_category: str
    total: float

    class Config:
        from_attributes = True
