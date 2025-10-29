from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from config import Config
from models import db, WeatherData
import os
import requests

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/api/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location', 'New York')
    layer = request.args.get('layer', 'precipitation_new')

    try:
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={OPENWEATHER_API_KEY}"
        geo_response = requests.get(geo_url)
        geo_data = geo_response.json()

        if not geo_data:
            return jsonify({"error": "Location not found"}), 404
        
        lat = geo_data[0]['lat']
        lon = geo_data[0]['lon']
        city_name = geo_data[0]['name']

        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()

        weather_map_url = f"https://tile.openweathermap.org/map/{layer}/{{z}}/{{x}}/{{y}}.png?appid={OPENWEATHER_API_KEY}"

        if weather_response.status_code == 200:
            weather_entry = WeatherData (
                location= city_name,
                latitude= lat,
                longitude= lon,
                temperature= weather_data['main']['temp'],
                description= weather_data['weather'][0]['description'],
                humidity= weather_data['main']['humidity'],
                wind_speed= weather_data['wind']['speed'],
            )
            db.session.add(weather_entry)
            db.session.commit()

            return jsonify({
                'location': city_name,
                'lat': lat,
                'lon': lon,
                'temperature': weather_data['main']['temp'],
                'description': weather_data['weather'][0]['description'],
                'humidity': weather_data['main']['humidity'],
                'wind_speed': weather_data['wind']['speed'],
                'weather_map': weather_map_url,
            }), 200
        else:
            return jsonify({"error": "Failed to fetch weather data"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/weather/history', methods=['GET'])
def get_weather_history():
    location = request.args.get('location')
    limit = request.args.get('limit', 10, type=int)

    try:
        if location:
            history = WeatherData.query.filter_by(location=location).order_by(WeatherData.timestamp.desc()).limit(limit).all()
        else:
            history = WeatherData.query.order_by(WeatherData.timestamp.desc()).limit(limit).all()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)