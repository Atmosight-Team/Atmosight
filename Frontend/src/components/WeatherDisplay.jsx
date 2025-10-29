import React, {useState, useEffect, use} from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

function WeatherDisplay() {
    const [location, setLocation] = useState('New York');
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState('metric');

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/weather?location=${location}`);
            const data = await response.json();

            if (response.ok) {
                setWeather(data);
                if (data.lat && data.lon) {
                setMapCenter([data.lat, data.lon]);
            }
            } else {
                setError(data.message || 'Error fetching weather data.');
            }   

        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    const Celsius = (kelvin) => {
        return kelvin - 273.15
    }

    const Fahrenheit = (kelvin) => {
        return (kelvin - 273.15) * 9/5 + 32
    }

    const getTemperature = () => {
        const kelvin = weather.temperature
        const celsius = Celsius(kelvin);

        if (unit === 'imperial') {
            return Math.round(Fahrenheit(kelvin)) + '°F';
        } else {
            return Math.round(celsius) + '°C';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather();
    }

    return (

        <div className='min-h-screen bg-gradient-to-t from-red-300 from-10% via-orange-200 via-30% to-cyan-50 to-50% to-indigo-50 to-90%'>
            <div className='flex flex-col w-full md:w-1/3 space-y-8 ml-2'>
                    <form onSubmit={handleSearch}>
                        <div className='justify-center mb-4 h-12 w-57'>
                            <ButtonGroup className="flex mt-2">
                                <Input className='border border-black 1px'
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter city"/>
                                <Button className='border border-black 1px'
                                type="submit"
                                disabled={loading}
                                >
                                    {loading ? <Spinner className='size-4'/> : '⌕'}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </form>
            </div>
            {error && <p className="text-red-500"></p>}

            {!weather && !loading && (
                <div>
                    <p className="object-center text-center sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Atmosight</p>
                </div>
            )}

            {weather && (
                <div class="flex flex-row justify-center px-4">
                    <div className='flex flex-col max-w-6xl'>
                        <div className='w-100'>
                            <div className="flex h-5 items-center basis-2/8 mr-5">
                                <div className='text-2xl'>{weather.location}</div>
                                <Separator className='bg-black mr-2 ml-2' orientation="vertical"/>
                                <div>{getTemperature()}</div>
                            </div>
                            <Separator className='my-2 bg-black'/>
                            <div className='mb-2'>
                                <div>Weather Condition: {weather.description}</div>
                                <div>Humidity: {weather.humidity}%</div>
                                <div>Wind Speed: {weather.wind_speed}</div>
                            </div>
                        </div>
                        <div className='grow'>
                            <div className='w-200 h-100 overflow-hidden'>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={10}
                                    scrollWheelZoom={false}
                                    className="w-full h-full"
                                >           
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {weather?.weather_map && (
                                    <TileLayer
                                        url={weather.weather_map}
                                    />
                                )}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ButtonGroup className="absolute top-4 right-4">
                <ButtonGroupText 
                    onClick={() => setUnit('imperial')}
                    className={unit === 'imperial' ? 'bg-black text-white' : ''}>°F</ButtonGroupText>
                <ButtonGroupSeparator className="" />
                <ButtonGroupText 
                    onClick={() => setUnit('metric')}
                    className={unit === 'metric' ? 'bg-black text-white' : ''}>°C</ButtonGroupText>
            </ButtonGroup>

        </div> 
        
    );
}

export default WeatherDisplay