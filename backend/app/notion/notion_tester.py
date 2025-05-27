"""
This script is used to test the connection to the Notion API and print a few rows from the Finances database.
"""

from notion_client import Client
from datetime import datetime
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Get Notion credentials from environment
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

def print_database_structure():
    """Print the structure of the Notion database."""
    notion = Client(auth=NOTION_API_KEY)
    
    try:
        # Get database metadata
        database = notion.databases.retrieve(database_id=NOTION_DATABASE_ID)
        print("\n=== Database Structure ===")
        print("Database Title:", database.get("title", [{}])[0].get("text", {}).get("content", "Untitled"))
        print("\nProperties:")
        for prop_name, prop_details in database["properties"].items():
            print(f"- {prop_name}: {prop_details['type']}")
    except Exception as e:
        print(f"Error getting database structure: {str(e)}")

def explore_expenses():
    """Print the first few expenses from the database."""
    notion = Client(auth=NOTION_API_KEY)
    
    try:
        # Query the database
        response = notion.databases.query(
            database_id=NOTION_DATABASE_ID,
            sorts=[{
                "property": "Date",
                "direction": "descending"
            }]
        )
        
        print("\n=== First 3 Expenses ===")
        for i, page in enumerate(response["results"][:3]):
            print(f"\nExpense {i + 1}:")
            properties = page["properties"]
            
            # Print each property
            for prop_name, prop_details in properties.items():
                prop_type = prop_details["type"]
                value = None
                
                if prop_type == "number":
                    value = prop_details["number"]
                elif prop_type == "title":
                    value = prop_details["title"][0]["text"]["content"] if prop_details["title"] else None
                elif prop_type == "select":
                    value = prop_details["select"]["name"] if prop_details["select"] else None
                elif prop_type == "date":
                    value = prop_details["date"]["start"] if prop_details["date"] else None
                
                print(f"  {prop_name}: {value}")
            
            # Print the raw data for inspection
            print("\n  Raw data:")
            print(json.dumps(properties, indent=2))
            
    except Exception as e:
        print(f"Error exploring expenses: {str(e)}")

if __name__ == "__main__":
    print("Exploring Notion Database...")
    print_database_structure()
    explore_expenses() 