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

function WeatherDisplay() {
    const [location, setLocation] = useState('New York');
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
            return Math.round(Fahrenheit(kelvin)) + '°F';  // Convert Celsius to Fahrenheit and round to nearest whole number
        } else {
            return Math.round(celsius) + '°C';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather();
    }

    return (

        <div className='relative flex items-center justify-center min-h-screen bg-gradient-to-t from-red-300 from-10% via-orange-200 via-30% to-cyan-50 to-50% to-indigo-50 to-90%'>
            {!weather && !loading && (
                <div>
                    <p className="sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Atmosight</p>
                </div>
            )}
            <div className='absolute top-4 left-4'>
                <h2 className='sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-2'>Weather</h2>
                    <form onSubmit={handleSearch}>
                        <p className='underline'>Location</p>
                        <div className='justify-center content-center h-12 w-57'>
                            <ButtonGroup className="h-40 w-57 mt-2">
                                <Input className='border border-black 1px'
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter city"/>
                                <Button className='border border-black 1px'
                                type="button"
                                disabled={loading}
                                >
                                    {loading ? <Spinner className='size-4'/> : '⌕'}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </form>
            </div>
            {error && <p className="text-red-500"></p>}

            {weather && (
                <div className='w-50'>
                    <div className="flex h-5 items-center">
                        <div className='text-2xl'>{weather.location}</div>
                        <Separator className='bg-black mr-2 ml-2' orientation="vertical"/>
                        <div>{getTemperature()}</div>
                    </div>
                    <Separator className='bg-black my-2' orientation='vertical'/>
                    <div className='flex items-center gap-4'/>
                    <Separator className='bg-black'/>
                    <div className='flex flex-col gap-1'>
                        <div>{weather.description}</div>
                        <div>Humidity: {weather.humidity}%</div>
                        <div>{weather.wind}</div>
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