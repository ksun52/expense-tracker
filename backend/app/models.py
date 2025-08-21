from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.core.enums import AccountType, ChangeType

from app.database.base import Base


class Transactions(Base):
    __tablename__ = "Transactions"

    # internal id trackers
    id = Column(Integer, primary_key=True, autoincrement=True)
    notion_id = Column(String, unique=True, nullable=True)

    # Transaction details the user sees
    name = Column(String, default="N/A")
    amount = Column(Float, index=True, default=0)
    date = Column(DateTime, index=True, default=lambda: datetime.now(UTC))
    category = Column(String, index=True, default="N/A")
    sub_category = Column(
        String, default=lambda context: context.get_current_parameters()['category'])
    method = Column(String, default="N/A")

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(
        UTC), onupdate=lambda: datetime.now(UTC))


class Income(Base):
    __tablename__ = "Income"

    id = Column(Integer, primary_key=True, autoincrement=True)
    notion_id = Column(String, unique=True, nullable=True)

    # Income details
    name = Column(String, default="N/A")
    amount = Column(Float, index=True, default=0)  # Will store positive values
    date_received = Column(DateTime, index=True,
                           default=lambda: datetime.now(UTC))
    # Default account for income
    account = Column(String, default="Checking Account")

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(
        UTC), onupdate=lambda: datetime.now(UTC))


class Budget(Base):
    __tablename__ = "Budget"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Budget details
    category = Column(String, index=True, nullable=False, unique=True)
    budget_amount = Column(Float, default=0.0)

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(
        UTC), onupdate=lambda: datetime.now(UTC))
