import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db
from models import Base, Word as WordModel
from schemas import Word, WordCreate

Base.metadata.create_all(bind=engine)

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
    return db.query(WordModel).all()

@app.post("/words", response_model=Word)
def create_word(word: WordCreate, db: Session = Depends(get_db)):
    db_word = WordModel(**word.model_dump())
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

@app.delete("/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(WordModel).filter(WordModel.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"message": "Word deleted"}

@app.get("/")
def read_root():
    return {"message": "Reading Words API"}

