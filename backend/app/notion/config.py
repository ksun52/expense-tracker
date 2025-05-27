import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Directory paths
NOTION_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(NOTION_DIR)
DATABASE_DIR = os.path.join(APP_DIR, 'database')

# Database configuration
DATABASE_URL = f"sqlite:///{os.path.join(DATABASE_DIR, 'finances.db')}"

# Notion configuration
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

# Logging configuration
LOG_LEVEL = "DEBUG"