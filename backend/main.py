import os
import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text

from database import engine, get_db
from models import Base, Word as WordModel
from schemas import Word, WordCreate

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_graphemes_to_strings():
    """Migrate existing graphemes arrays to strings in the database."""
    try:
        with engine.connect() as conn:
            # First, check if we need to migrate
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'words' AND column_name = 'graphemes'
            """))
            column_info = result.fetchone()
            
            if column_info and column_info[1] == 'ARRAY':
                logger.info("Starting graphemes migration from ARRAY to STRING")
                # Convert arrays to strings
                conn.execute(text("""
                    UPDATE words 
                    SET graphemes = array_to_string(graphemes, ',')
                    WHERE graphemes IS NOT NULL
                """))
                conn.commit()
                logger.info("Successfully migrated graphemes to strings")
    except Exception as e:
        logger.error(f"Error during migration: {str(e)}")

# Log database URL (without password)
db_url = os.getenv("DATABASE_URL", "")
if db_url:
    masked_url = db_url.replace(db_url.split("@")[0], "***")
    logger.info(f"Database URL: {masked_url}")

try:
    Base.metadata.create_all(bind=engine)
    migrate_graphemes_to_strings()  # Run migration after table creation
    logger.info("Database tables created and migration completed successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {str(e)}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://reading-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/words", response_model=List[Word])
def get_words(db: Session = Depends(get_db)):
    try:
        words = db.query(WordModel).all()
        logger.info(f"Successfully retrieved {len(words)} words")
        return words
    except Exception as e:
        logger.error(f"Error retrieving words: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/words", response_model=Word)
def create_word(word: WordCreate, db: Session = Depends(get_db)):
    try:
        db_word = WordModel(**word.model_dump())
        db.add(db_word)
        db.commit()
        db.refresh(db_word)
        logger.info(f"Successfully created word: {word.original_word}")
        return db_word
    except Exception as e:
        logger.error(f"Error creating word: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    try:
        word = db.query(WordModel).filter(WordModel.id == word_id).first()
        if not word:
            raise HTTPException(status_code=404, detail="Word not found")
        db.delete(word)
        db.commit()
        logger.info(f"Successfully deleted word with id: {word_id}")
        return {"message": "Word deleted"}
    except Exception as e:
        logger.error(f"Error deleting word: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Reading Words API"}

