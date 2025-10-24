import React, {useState, useEffect, use} from 'react'

function WeatherDisplay() {
    const [location, setLocation] = useState('New York');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/weather?location=${location}`);
            const data = await response.json();

            if (response.ok) {
                setWeather(data);
            } else {
                setError(data.message || 'Error fetching weather data.');
            }   

        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather();
    }

    return (
        <div>
            <h2>Weather</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city"
                />
                <button
                  type="button"
                  disabled={loading}
                >
                    {loading ? 'Loading...' : 'Search'}
                </button>
            </form>
            {error && <p className="text-red-500"></p>}

            {weather && (
                <div>
                    <p>{weather.location}</p>
                    <p>{weather.temperature}</p>
                    <p>{weather.description}</p>
                    <p>{weather.humidity}</p>
                    <p>{weather.wind}</p>
                </div>
            )}
        </div>  
    );
}

export default WeatherDisplay