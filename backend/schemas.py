from pydantic import BaseModel
from datetime import datetime

class WordCreate(BaseModel):
    word: str
    category: str
    image_url: str

class Word(BaseModel):
    id: int
    word: str
    category: str
    image_url: str
    created_at: datetime
    
    class Config:
        from_attributes = True