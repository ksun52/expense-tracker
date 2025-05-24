from notion_client import Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

notion = Client(auth=os.getenv("NOTION_API_KEY"))
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

def get_expenses():
    """Fetch all expenses from the Notion database."""
    try:
        response = notion.databases.query(
            database_id=DATABASE_ID,
            sorts=[{
                "property": "Date",
                "direction": "descending"
            }]
        )
        
        expenses = []
        for page in response["results"]:
            properties = page["properties"]
            
            # Extract expense data from Notion properties
            # Note: Adjust these property names based on your Notion database structure
            amount = properties.get("Amount", {}).get("number", 0)
            description = properties.get("Description", {}).get("title", [{}])[0].get("text", {}).get("content", "")
            category = properties.get("Category", {}).get("select", {}).get("name", "")
            date_str = properties.get("Date", {}).get("date", {}).get("start", "")
            
            # Convert date string to datetime object
            date = datetime.fromisoformat(date_str.replace("Z", "+00:00")) if date_str else None
            
            expense = {
                "notion_id": page["id"],
                "amount": amount,
                "description": description,
                "category": category,
                "date": date
            }
            expenses.append(expense)
            
        return expenses
    except Exception as e:
        print(f"Error fetching expenses from Notion: {str(e)}")
        return [] 