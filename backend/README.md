# Personal Expenditure Tracker

A personal finance tracking application that syncs data from Notion to a local SQLite database.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with your Notion API key:
```
NOTION_API_KEY=your_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

4. Run the application:
```bash
uvicorn main:app --reload
```

## Features

- Syncs data from Notion database (write/update) to local SQLite (read only)
- FastAPI backend
- React + Tailwind frontend (coming soon) 