from notion_client import Client
from datetime import datetime, UTC

import logging
from app.notion.config import *
from app.database.base import Base, SessionLocal
from app.models import Income, Transactions

# Set up logging
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)


class NotionConnector:
    def __init__(self):
        self.notion = Client(auth=NOTION_API_KEY)
        self.db = SessionLocal()

    def fetch_notion_transactions(self):
        """Fetch all transactions from Notion database."""
        try:
            transactions_list = []
            has_more = True
            start_cursor = None

            while has_more:
                # Prepare query parameters
                query_params = {
                    "database_id": NOTION_DATABASE_ID,
                    "sorts": [{
                        "property": "Date",
                        "direction": "descending"
                    }],
                    "page_size": 100  # Maximum allowed by Notion
                }

                # Add start_cursor if we have one
                if start_cursor:
                    query_params["start_cursor"] = start_cursor

                # Make the API call
                response = self.notion.databases.query(**query_params)

                # Process the results
                for page in response["results"]:
                    properties = page["properties"]

                    # skip empty rows by rejecting those with no name
                    if not properties.get("Name", {}).get("title", [{}]):
                        logger.warning(
                            f"Skipping empty row with ID: {page['id']}")
                        continue

                    # Extract transaction data from Notion properties
                    # First get the content inside of each property and check if it is empty
                    name = properties.get("Name", {}).get(
                        "title", [{}])[0].get("text", {})
                    amount = properties.get("Amount", {})
                    date_str = properties.get("Date", {}).get("date", {})
                    method = properties.get("Method", {}).get("select", {})
                    category = properties.get("Category", {}).get("select", {})
                    sub_category = properties.get(
                        "Subcategory", {}).get("select", {})

                    # now we can actualy extract the value that is inside the property if it exists
                    if name is not None:
                        name = name.get("content", "")
                    if amount is not None:
                        amount = amount.get("number", 0)
                    if date_str is not None:
                        date_str = date_str.get("start", "")
                    if method is not None:
                        method = method.get("name", "")
                    if category is not None:
                        category = category.get("name", "")
                    if sub_category is not None:
                        sub_category = sub_category.get("name", "")

                    # Convert date string to datetime object
                    date = datetime.fromisoformat(
                        date_str) if date_str else None

                    transaction = {
                        "notion_id": page["id"],
                        "name": name,
                        "amount": amount,
                        "date": date,
                        "method": method,
                        "category": category,
                        "sub_category": sub_category
                    }

                    # check for missing values and add default + raise warning
                    value_missing = False
                    if transaction["name"] is None:
                        transaction["name"] = "N/A"
                        value_missing = True
                    if transaction["amount"] is None:
                        transaction["amount"] = 0
                        value_missing = True
                    if transaction["date"] is None:
                        transaction["date"] = datetime.now(UTC)
                        value_missing = True
                    if transaction["category"] is None:
                        transaction["category"] = "N/A"
                        value_missing = True
                    if transaction["method"] is None:
                        transaction["method"] = "N/A"
                        value_missing = True
                    if transaction["sub_category"] is None:
                        transaction["sub_category"] = transaction["category"]
                        value_missing = True

                    if value_missing:
                        logger.warning(
                            f"Missing one or more values for transaction: '{transaction['name']}' - ensure this is filled out in Notion")

                    transactions_list.append(transaction)

                # Check if there are more pages
                has_more = response.get("has_more", False)
                start_cursor = response.get("next_cursor")

                # Log progress
                logger.info(
                    f"Fetched {len(transactions_list)} transactions so far...")

            logger.info(
                f"Total transactions fetched: {len(transactions_list)}")
            return transactions_list

        except Exception as e:
            logger.error(f"Error fetching transactions from Notion: {str(e)}")
            raise

    def sync_to_sqlite(self):
        """Sync transactions from Notion to SQLite database."""
        try:
            # Get transactions from Notion
            notion_transactions = self.fetch_notion_transactions()

            # Get all notion_ids from Notion
            notion_ids = {transaction["notion_id"]
                          for transaction in notion_transactions}

            # Track statistics
            stats = {
                "total": len(notion_transactions),
                "created": 0,
                "updated": 0,
                "deleted": 0,
                "errors": 0
            }

            # Find transactions that exist in database but not in Notion
            db_transactions = self.db.query(Transactions).all()
            for row_transaction in db_transactions:
                if row_transaction.notion_id not in notion_ids:
                    # Delete transaction that no longer exists in Notion
                    self.db.delete(row_transaction)
                    stats["deleted"] += 1

            for transaction_data in notion_transactions:
                try:
                    # Check if transaction already exists
                    existing_transaction = self.db.query(Transactions).filter(
                        Transactions.notion_id == transaction_data["notion_id"]
                    ).first()

                    if existing_transaction:
                        # Update existing transaction
                        any_updates = False
                        for key, value in transaction_data.items():
                            if getattr(existing_transaction, key) != value:
                                setattr(existing_transaction, key, value)
                                any_updates = True
                        if any_updates:
                            stats["updated"] += 1
                    else:
                        if transaction_data["category"] == "income":
                            new_income = Income(
                                notion_id=transaction_data["notion_id"],
                                name=transaction_data["name"],
                                amount=transaction_data["amount"],
                                date_received=transaction_data["date"],
                                account=transaction_data["method"]
                            )
                            self.db.add(new_income)
                            logger.info(
                                f"Created new income: {new_income.name}")
                        else:
                            # Create new transaction
                            new_transaction = Transactions(**transaction_data)
                            self.db.add(new_transaction)
                        stats["created"] += 1

                except Exception as e:
                    logger.error(
                        f"Error processing transaction {transaction_data.get('notion_id')} with name {transaction_data.get('name')}: {str(e)}")
                    stats["errors"] += 1
                    continue

            # Commit changes
            self.db.commit()

            # Log sync results
            logger.info(f"Sync completed: {stats['total']} total, {stats['created']} created, "
                        f"{stats['updated']} updated, {stats['errors']} errors")

            return stats

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error during sync: {str(e)}")
            raise
        finally:
            self.db.close()


def sync_transactions():
    """Convenience function to run the sync process."""
    connector = NotionConnector()
    return connector.sync_to_sqlite()


if __name__ == "__main__":
    # Test the sync process
    try:
        stats = sync_transactions()
        print(f"Sync completed successfully: {stats}")
    except Exception as e:
        print(f"Sync failed: {str(e)}")
