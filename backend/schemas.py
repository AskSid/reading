from pydantic import BaseModel
from datetime import datetime

class FlashcardCreate(BaseModel):
    question: str
    answer: str

class Flashcard(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime
    
    class Config:
        from_attributes = True