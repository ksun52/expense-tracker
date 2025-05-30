import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Notion configuration
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

# Logging configuration
LOG_LEVEL = "DEBUG"