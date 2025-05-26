from notion_client import Client
from datetime import datetime, UTC
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
import logging
from config import *

# Set up logging
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)

# SQLite setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
    sub_category = Column(String, default="N/A")
    method = Column(String, default="N/A")

    # internal metadata
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

# Create tables
Base.metadata.create_all(bind=engine)

class NotionConnector:
    def __init__(self):
        self.notion = Client(auth=NOTION_API_KEY)
        self.db = SessionLocal()

    def fetch_notion_expenses(self):
        """Fetch all expenses from Notion database."""
        try:
            expenses_list = []
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
                        logger.warning(f"Skipping empty row with ID: {page['id']}")
                        continue

                    # Extract expense data from Notion properties
                    # First get the content inside of each property and check if it is empty 
                    name = properties.get("Name", {}).get("title", [{}])[0].get("text", {})
                    amount = properties.get("Amount", {})
                    date_str = properties.get("Date", {}).get("date", {})
                    method = properties.get("Method", {}).get("select", {})
                    category = properties.get("Category", {}).get("select", {})
                    sub_category = properties.get("Subcategory", {}).get("select", {})
                    
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
                    date = datetime.fromisoformat(date_str) if date_str else None
                    
                    expense = {
                        "notion_id": page["id"],
                        "name": name,
                        "amount": amount,
                        "date": date,
                        "method": method,
                        "category": category,
                        "sub_category": sub_category
                    }
                    
                    # check for missing values and raise warning only 
                    for key, value in expense.items():
                        if value is None and key != "sub_category":
                            logger.warning(f"Missing value for key: '{key}' for expense: '{expense['name']}' - ensure this is filled out in Notion")
                            
                    expenses_list.append(expense)
                
                # Check if there are more pages
                has_more = response.get("has_more", False)
                start_cursor = response.get("next_cursor")
                
                # Log progress
                logger.info(f"Fetched {len(expenses_list)} expenses so far...")
            
            logger.info(f"Total expenses fetched: {len(expenses_list)}")
            return expenses_list
            
        except Exception as e:
            logger.error(f"Error fetching expenses from Notion: {str(e)}")
            raise

    def sync_to_sqlite(self):
        """Sync expenses from Notion to SQLite database."""
        try:
            # Get expenses from Notion
            notion_expenses = self.fetch_notion_expenses()

            # Get all notion_ids from Notion
            notion_ids = {expense["notion_id"] for expense in notion_expenses}
            
            # Track statistics
            stats = {
                "total": len(notion_expenses),
                "created": 0,
                "updated": 0,
                "deleted": 0,
                "errors": 0
            }

            # Find expenses that exist in database but not in Notion
            db_expenses = self.db.query(Expenses).all()
            for row_expense in db_expenses:
                if row_expense.notion_id not in notion_ids:
                    # Delete expense that no longer exists in Notion
                    self.db.delete(row_expense)
                    stats["deleted"] += 1
            
            for expense_data in notion_expenses:
                try:
                    # Check if expense already exists
                    existing_expense = self.db.query(Expenses).filter(
                        Expenses.notion_id == expense_data["notion_id"]
                    ).first()
                    
                    if existing_expense:
                        # Update existing expense
                        any_updates = False
                        for key, value in expense_data.items():
                            if getattr(existing_expense, key) != value:
                                setattr(existing_expense, key, value)
                                any_updates = True
                        if any_updates:
                            stats["updated"] += 1
                    else:
                        # Create new expense
                        new_expense = Expenses(**expense_data)
                        self.db.add(new_expense)
                        stats["created"] += 1
                    
                except Exception as e:
                    logger.error(f"Error processing expense {expense_data.get('notion_id')} with name {expense_data.get('name')}: {str(e)}")
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

def sync_expenses():
    """Convenience function to run the sync process."""
    connector = NotionConnector()
    return connector.sync_to_sqlite()

if __name__ == "__main__":
    # Test the sync process
    try:
        stats = sync_expenses()
        print(f"Sync completed successfully: {stats}")
    except Exception as e:
        print(f"Sync failed: {str(e)}")