from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ExpenseResponse(BaseModel):
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