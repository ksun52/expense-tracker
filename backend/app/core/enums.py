from enum import Enum

class AccountType(Enum):
  CASH = "cash"
  INVESTING = "investing"
  DEBT = "debt"

class ChangeType(Enum):
  TRANSACTION = "transaction"
  INCOME = "income"
  TRANSFER = "transfer"
  MANUAL_ADJUSTMENT = "manual_adjustment"
  DEBT_PAYMENT = "debt_payment"