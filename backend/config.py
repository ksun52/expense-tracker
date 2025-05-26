import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Directory paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

# Database configuration
DATABASE_URL = f"sqlite:///{os.path.join(BACKEND_DIR, 'finances.db')}"

# Notion configuration
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

# Logging configuration
LOG_LEVEL = "DEBUG"

# API configuration
# API_VERSION = "v1"
# DEBUG = os.getenv("DEBUG", "False").lower() == "true"

