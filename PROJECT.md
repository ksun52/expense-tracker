# Personal Expenditure Tracker

## Project Goals
- Create a personal finance tracking application
- Sync data from Notion (primary data entry) to a local SQLite database
- Provide a clean, modern UI for viewing and analyzing expenses
- Learn and understand the full stack development process incrementally

## Tech Stack Decisions
### Backend
- FastAPI (Python) for the API server
  - Chosen for its modern async support, automatic API documentation, and Python's data processing capabilities
- SQLite for local data storage
  - Read-only mirror of Notion data
  - Simple to set up and maintain
  - No need for complex database management
- Notion API for data source
  - Leverages existing Notion database for easy data entry
  - Familiar interface for data management
  - Robust API for data retrieval

### Frontend (Planned)
- React for UI framework
- Tailwind CSS for styling
  - Modern, utility-first approach
  - Easy to maintain and customize
  - Great developer experience

## Development Approach
- Incremental development to understand each component
- Start with backend data sync (Notion → SQLite)
- Then build API endpoints
- Finally implement frontend

## Current Progress
- Setting up basic project structure
- Implementing Notion API integration
- Creating SQLite database schema
- Planning FastAPI endpoints

## Future Considerations
- Data visualization features
- Expense categorization and analysis
- Budget tracking
- Export capabilities
- Mobile responsiveness

## Key Decisions Made
1. Using Notion as primary data source
   - Pros: Familiar interface, easy updates, existing data
   - Cons: Need to handle API rate limits, sync complexity

2. SQLite as local storage
   - Pros: Simple, no server needed, good for personal use
   - Cons: Limited concurrent access, not suitable for multiple users

3. FastAPI for backend
   - Pros: Modern, fast, great documentation
   - Cons: Learning curve if not familiar with async Python

4. React + Tailwind for frontend
   - Pros: Modern, maintainable, great ecosystem
   - Cons: Initial setup complexity

## Environment Setup
- Python virtual environment
- Required packages:
  - fastapi
  - uvicorn
  - notion-client
  - python-dotenv
  - sqlalchemy
  - pydantic 