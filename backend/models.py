from sqlalchemy import Column, Integer, String, DateTime, ARRAY
from sqlalchemy.sql import func
from database import Base

class Word(Base):
    __tablename__ = "words"
    
    id = Column(Integer, primary_key=True, index=True)
    original_word = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    graphemes = Column(ARRAY(String), nullable=True)