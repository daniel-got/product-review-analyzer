from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.db import Base

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    product_name = Column(String(255), nullable=False)
    review_text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    
    # Hasil Analisis AI
    sentiment_label = Column(String(50))  # POSITIVE / NEGATIVE / NEUTRAL
    sentiment_score = Column(String(50))  # Confidence score
    key_points = Column(Text)             # Hasil summary dari Gemini
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "review_text": self.review_text,
            "rating": self.rating,
            "sentiment": self.sentiment_label,
            "key_points": self.key_points,
            "created_at": str(self.created_at)
        }
