import requests
from datetime import datetime, timedelta

class WeatherService:
    
    @staticmethod
    def get_historical_weather(lat, lon, days=30):
        """
        Fetch historical weather data for the past 'days' days for the given latitude and longitude.
        From Open-Meteo
        """
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)

        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lon,
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d'),
            'daily': 'temperature_2m_mean,relative_humidity_2m_mean,wind_speed_10m_mean',
            'timezone': 'auto'
        }

        try:
            response = requests.get(url, params=params)
            data = response.json()

            if response.status_code == 200:
                historical_data = []
                for i in range(len(data['daily']['time'])):
                    day_data = {
                        'date': data['daily']['time'][i],
                        'temperature': data['daily']['temperature_2m_mean'][i],
                        'humidity': data['daily']['relative_humidity_2m_mean'][i],
                        'wind_speed': data['daily']['wind_speed_10m_mean'][i],
                    }
                    historical_data.append(day_data)
                return historical_data
            else:
                return None
        except Exception as e:
            print(f"Error fetching historical weather data: {e}")
            return None