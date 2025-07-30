from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Float, DateTime
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
    sub_category = Column(String, default=lambda context: context.get_current_parameters()['category'])
    method = Column(String, default="N/A")

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

class Income(Base):
    __tablename__ = "Income"

    id = Column(Integer, primary_key=True, autoincrement=True)
    notion_id = Column(String, unique=True, nullable=True)
    
    # Income details
    name = Column(String, default="N/A")
    amount = Column(Float, index=True, default=0)  # Will store positive values
    date_received = Column(DateTime, index=True, default=lambda: datetime.now(UTC))
    account = Column(String, default="Checking Account")  # Default account for income
    
    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

class Account(Base):
    __tablename__ = "Account"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    current_balance = Column(Float, default=0.0)
    
    # For debt accounts - track which payment methods belong to this account
    associated_methods = Column(String)  # JSON string of payment methods
    
    # Metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationship to history
    history = relationship("AccountHistory", back_populates="account", cascade="all, delete-orphan")

class AccountHistory(Base):
    __tablename__ = "AccountHistory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("Account.id"), nullable=False)
    
    # Transaction details
    previous_balance = Column(Float, nullable=False)
    amount_changed = Column(Float, nullable=False)  # Positive for increases, negative for decreases
    new_balance = Column(Float, nullable=False)
    
    # Context about the change
    change_type = Column(String, nullable=False)  # 'transaction', 'income', 'transfer', 'manual_adjustment', 'debt_payment'
    related_transaction_id = Column(Integer, ForeignKey("Transactions.id"), nullable=True)
    related_income_id = Column(Integer, ForeignKey("Income.id"), nullable=True)
    description = Column(Text)
    
    # Metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    # Relationships
    account = relationship("Account", back_populates="history")
    transaction = relationship("Transactions")
    income = relationship("Income") 