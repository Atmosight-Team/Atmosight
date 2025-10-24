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

        <div className='relative flex items-center justify-center min-h-screen bg-gradient-to-t from-red-300 from-10% via-orange-200 via-30% to-cyan-50 to-50% to-indigo-50 to-90%'>
            <div className>
                <p className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Atmosight</p>
            </div>

            <h2 className='absolute top-4 left-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold'>Weather</h2>
                <form onSubmit={handleSearch} className='absolute top-16 left-4'>
                    <p className='underline'>Location</p>
                    <div className='border border-black 1px rounded'>
                        <input className='pb-1 pt-1 ml-2 pl-1'
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter city"
                        />
                        <button className='p-2 text-lg'
                        type="button"
                        disabled={loading}
                        >
                            {loading ? 'Loading...' : '⌕'}
                        </button>
                    </div>
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