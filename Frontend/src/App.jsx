import React from 'react'
import HealthCheck from './components/HealthCheck';
import WeatherDisplay from './components/WeatherDisplay';

const App = () => {
  return (
    <div>
      <HealthCheck />
      <WeatherDisplay />
    </div>
  )
}

export default App