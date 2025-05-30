from app.database.base import Base, engine

def init_db():
    """Initialize the database by creating all tables."""
    Base.metadata.create_all(bind=engine) 