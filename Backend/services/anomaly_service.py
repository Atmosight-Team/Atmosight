import numpy as np
from services.weather_service import WeatherService

class AnomalyDetector:

    @staticmethod
    def detect_anomalies(lat, lon, current_temp, current_humidity, current_wind_speed):
        """
        Detect anomalies in the current weather data compared to historical data.        
        """

        historical_data = WeatherService.get_historical_weather(lat, lon, days=30)

        if not historical_data or len(historical_data) < 7:
            return {
                'has_data': False,
                'message': 'Insufficient historical data for anomaly detection.'
            }
        
        # Using numpy for cleaner code
        temperatures = np.array([d["temperature"] for d in historical_data if d["temperature"] is not None])
        mean_temp = np.mean(temperatures)
        std_temp = np.std(temperatures, ddof=1)
        
        humidities = np.array([d["humidity"] for d in historical_data if d["humidity"] is not None])
        mean_humidity = np.mean(humidities)
        std_humidity = np.std(humidities, ddof=1)
        
        wind_speeds = np.array([d["wind_speed"] for d in historical_data if d["wind_speed"] is not None])
        mean_wind = np.mean(wind_speeds)
        std_wind = np.std(wind_speeds, ddof=1)
    
        # Anomaly detection
        temperature_z_score = (current_temp - mean_temp) / std_temp
        is_temp_anomaly = abs(temperature_z_score) > 2

        humidity_z_score = (current_humidity - mean_humidity) / std_humidity
        is_humidity_anomaly = abs(humidity_z_score) > 2

        wind_z_score = (current_wind_speed - mean_wind) / std_wind
        is_wind_anomaly = abs(wind_z_score) > 2

        anomalies = {
            'has_data': True,
            'temperature': {
                'is_anomaly': is_temp_anomaly,
                'current': current_temp,
                'z_score': temperature_z_score,
                'mean': mean_temp,
                'std_dev': std_temp,
                'message': (
                    f"{'Unusually high' if temperature_z_score > 0 else 'Unusually low'} temperature detected."
                )
            },
            'humidity': {
                'is_anomaly': is_humidity_anomaly,
                'current': current_humidity,
                'z_score': humidity_z_score,
                'mean': mean_humidity,
                'std_dev': std_humidity,
                'message': (
                    f"{'Unusually high' if humidity_z_score > 0 else 'Unusually low'} humidity detected."
                )
            },
            'wind_speed': {
                'is_anomaly': is_wind_anomaly,
                'current': current_wind_speed,
                'z_score': wind_z_score,
                'mean': mean_wind,
                'std_dev': std_wind,
                'message': (
                    f"{'Unusually high' if wind_z_score > 0 else 'Unusually low'} wind speed detected."
                )
            },
            'data_points': len(historical_data)
        }

