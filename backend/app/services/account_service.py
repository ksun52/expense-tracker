from sqlalchemy.orm import Session
from app.models import Account, AccountHistory, Transactions, Income, AccountType
from app.schemas import AccountCreate, AccountUpdate, AccountManualAdjustment
from datetime import datetime, UTC
import json
from typing import List, Optional


class AccountService:
    def __init__(self, db: Session):
        self.db = db

    def create_account(self, account_data: AccountCreate) -> Account:
        """Create a new account with initial balance and history."""
        account = Account(
            name=account_data.name,
            account_type=account_data.account_type,
            current_balance=account_data.initial_balance,
            associated_methods=account_data.associated_methods
        )

        self.db.add(account)
        self.db.flush()  # Get the account ID

        # Create initial history record if there's an initial balance
        if account_data.initial_balance != 0:
            self._create_history_record(
                account=account,
                previous_balance=0.0,
                amount_changed=account_data.initial_balance,
                new_balance=account_data.initial_balance,
                change_type="initial_balance",
                description="Initial account balance"
            )

        self.db.commit()
        return account

    def get_all_accounts(self) -> List[Account]:
        """Get all accounts with their current balances."""
        return self.db.query(Account).all()

    def get_account_by_id(self, account_id: int) -> Optional[Account]:
        """Get a specific account by ID."""
        return self.db.query(Account).filter(Account.id == account_id).first()

    def get_account_by_name(self, name: str) -> Optional[Account]:
        """Get a specific account by name."""
        return self.db.query(Account).filter(Account.name == name).first()

    def update_account(self, account_id: int, account_data: AccountUpdate) -> Optional[Account]:
        """Update account details (not balance)."""
        account = self.get_account_by_id(account_id)
        if not account:
            return None

        if account_data.name:
            account.name = account_data.name
        if account_data.associated_methods is not None:
            account.associated_methods = account_data.associated_methods

        account.updated_at = datetime.now(UTC)
        self.db.commit()
        return account

    def manual_adjustment(self, account_id: int, adjustment: AccountManualAdjustment) -> Optional[Account]:
        """Manually adjust account balance."""
        account = self.get_account_by_id(account_id)
        if not account:
            return None

        previous_balance = account.current_balance
        new_balance = previous_balance + adjustment.amount

        # Update account balance
        account.current_balance = new_balance
        account.updated_at = datetime.now(UTC)

        # Create history record
        self._create_history_record(
            account=account,
            previous_balance=previous_balance,
            amount_changed=adjustment.amount,
            new_balance=new_balance,
            change_type="manual_adjustment",
            description=adjustment.description
        )

        self.db.commit()
        return account

    def transfer_between_accounts(self, from_account_id: int, to_account_id: int,
                                  amount: float, description: str = None) -> bool:
        """Transfer money between two accounts."""
        from_account = self.get_account_by_id(from_account_id)
        to_account = self.get_account_by_id(to_account_id)

        if not from_account or not to_account:
            return False

        if from_account.current_balance < amount:
            return False  # Insufficient funds

        # Update balances
        from_previous = from_account.current_balance
        to_previous = to_account.current_balance

        from_account.current_balance -= amount
        to_account.current_balance += amount

        from_account.updated_at = datetime.now(UTC)
        to_account.updated_at = datetime.now(UTC)

        # Create history records
        transfer_desc = description or f"Transfer to {to_account.name}"
        receive_desc = description or f"Transfer from {from_account.name}"

        self._create_history_record(
            account=from_account,
            previous_balance=from_previous,
            amount_changed=-amount,
            new_balance=from_account.current_balance,
            change_type="transfer",
            description=transfer_desc
        )

        self._create_history_record(
            account=to_account,
            previous_balance=to_previous,
            amount_changed=amount,
            new_balance=to_account.current_balance,
            change_type="transfer",
            description=receive_desc
        )

        self.db.commit()
        return True

    def update_balance_from_transaction(self, transaction: Transactions) -> None:
        """Update account balances based on a transaction."""
        # Handle different payment methods
        if transaction.method.lower() == "debit":
            self._update_checking_account(-transaction.amount, transaction)
        elif transaction.method.lower() == "venmo":
            self._update_venmo_account(-transaction.amount, transaction)
        else:
            # Try to match with debt accounts (credit cards)
            self._update_debt_account(transaction.amount, transaction)

    def update_balance_from_income(self, income: Income) -> None:
        """Update account balances based on income."""
        if income.account.lower() == "apple hysa":
            account = self._get_or_create_account(
                "Apple HYSA", AccountType.INVESTING)
        else:
            account = self._get_or_create_account(
                "Checking Account", AccountType.CASH)

        previous_balance = account.current_balance
        account.current_balance += income.amount
        account.updated_at = datetime.now(UTC)

        self._create_history_record(
            account=account,
            previous_balance=previous_balance,
            amount_changed=income.amount,
            new_balance=account.current_balance,
            change_type="income",
            related_income_id=income.id,
            description=f"Income: {income.name}"
        )

    def _update_checking_account(self, amount: float, transaction: Transactions) -> None:
        """Update checking account balance."""
        account = self._get_or_create_account(
            "Checking Account", AccountType.CASH)
        self._update_account_balance(
            account, amount, "transaction", transaction)

    def _update_venmo_account(self, amount: float, transaction: Transactions) -> None:
        """Update Venmo account balance."""
        account = self._get_or_create_account("Venmo", AccountType.CASH)
        self._update_account_balance(
            account, amount, "transaction", transaction)

    def _update_debt_account(self, amount: float, transaction: Transactions) -> None:
        """Update debt account balance - try to match by payment method."""
        # Look for existing debt accounts with matching payment methods
        debt_accounts = self.db.query(Account).filter(
            Account.account_type == AccountType.DEBT
        ).all()

        account_found = False
        for account in debt_accounts:
            if account.associated_methods:
                methods = json.loads(account.associated_methods)
                if transaction.method in methods:
                    self._update_account_balance(
                        account, amount, "transaction", transaction)
                    account_found = True
                    break

        # If no matching debt account found, could create a default one
        # or leave for manual assignment later
        if not account_found:
            # For now, we'll skip auto-assignment and let manual assignment handle it
            pass

    def _update_account_balance(self, account: Account, amount: float,
                                change_type: str, transaction: Transactions = None) -> None:
        """Helper to update account balance and create history."""
        previous_balance = account.current_balance
        account.current_balance += amount
        account.updated_at = datetime.now(UTC)

        self._create_history_record(
            account=account,
            previous_balance=previous_balance,
            amount_changed=amount,
            new_balance=account.current_balance,
            change_type=change_type,
            related_transaction_id=transaction.id if transaction else None,
            description=f"Transaction: {transaction.name}" if transaction else None
        )

    def _get_or_create_account(self, name: str, account_type: AccountType) -> Account:
        """Get existing account or create new one."""
        account = self.get_account_by_name(name)
        if not account:
            account = Account(
                name=name,
                account_type=account_type,
                current_balance=0.0
            )
            self.db.add(account)
            self.db.flush()
        return account

    def _create_history_record(self, account: Account, previous_balance: float,
                               amount_changed: float, new_balance: float, change_type: str,
                               related_transaction_id: int = None, related_income_id: int = None,
                               description: str = None) -> None:
        """Create an account history record."""
        history = AccountHistory(
            account_id=account.id,
            previous_balance=previous_balance,
            amount_changed=amount_changed,
            new_balance=new_balance,
            change_type=change_type,
            related_transaction_id=related_transaction_id,
            related_income_id=related_income_id,
            description=description
        )
        self.db.add(history)
