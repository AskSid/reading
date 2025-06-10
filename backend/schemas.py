from pydantic import BaseModel
from datetime import datetime

class WordCreate(BaseModel):
    original_word: str
    category: str
    image_url: str

class Word(BaseModel):
    id: int
    original_word: str
    category: str
    image_url: str
    
    class Config:
        from_attributes = True