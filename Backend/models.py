from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class WeatherData(db.Model):
    __tablename__ = 'weather_data'

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    wind_speed = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<WeatherData {self.location} at {self.timestamp}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "temperature": self.temperature,
            "description": self.description,
            "humidity": self.humidity,
            "wind_speed": self.wind_speed,
            "timestamp": self.timestamp.isoformat()
        }