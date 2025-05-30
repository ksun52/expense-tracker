from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.base import Base

class Expenses(Base):
    __tablename__ = "Expenses"

    # internal id trackers 
    id = Column(Integer, primary_key=True, autoincrement=True)
    notion_id = Column(String, unique=True, nullable=True)
    
    # Expense details the user sees
    name = Column(String, default="N/A")
    amount = Column(Float, index=True, default=0)
    date = Column(DateTime, index=True, default=lambda: datetime.now(UTC))
    category = Column(String, index=True, default="N/A")
    sub_category = Column(String, default=lambda context: context.get_current_parameters()['category'])
    method = Column(String, default="N/A")

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC)) 