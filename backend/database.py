import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use environment variable for production, fallback to local for development
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://your_username@localhost/reading")
DATABASE_URL = "postgresql://siddharthboppana:Leg0s2012!@localhost/reading"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()