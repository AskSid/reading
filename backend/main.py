from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db
from models import Base, Flashcard as FlashcardModel
from schemas import Flashcard, FlashcardCreate

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/flashcards", response_model=List[Flashcard])
def get_flashcards(db: Session = Depends(get_db)):
    return db.query(FlashcardModel).all()

@app.post("/flashcards", response_model=Flashcard)
def create_flashcard(flashcard: FlashcardCreate, db: Session = Depends(get_db)):
    db_flashcard = FlashcardModel(**flashcard.model_dump())
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@app.delete("/flashcards/{flashcard_id}")
def delete_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(FlashcardModel).filter(FlashcardModel.id == flashcard_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    db.delete(flashcard)
    db.commit()
    return {"message": "Flashcard deleted"}