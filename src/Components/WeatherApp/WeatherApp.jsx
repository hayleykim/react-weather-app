import React, { useEffect, useRef, useState } from 'react';
import './WeatherApp.css';
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import humidity_icon from '../Assets/humidity.png'

const WeatherApp = () => {

  let api_key = process.env.REACT_APP_API_KEY;

  const [weatherData, setWeatherData] = useState(null);
  const [weathericon, setWeatherIcon] = useState(null);
  const inputRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  

  const handleSearch = async () => {
    const element = document.getElementsByClassName("cityInput");
    if(element[0].value === "") return;

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${ element[0].value }&units=Metric&appid=${ api_key }`;

    try{
      let response = await fetch(url);
      let data = await response.json();

      setWeatherData({
        temperature: Math.floor(data.main.temp),
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: Math.floor(data.wind.speed)
      });

      setWeatherIcon(getWeatherIcon(data.weather[0].icon));

      inputRef.current.value = '';
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
        case "01d":
        case "01n":
            return clear_icon;
        case "02d":
        case "02n":
            return cloud_icon;
        case "03d":
        case "03n":
            return drizzle_icon;
        case "04d":
        case "04n":
            return drizzle_icon;
        case "09d":
        case "09n":
            return rain_icon;
        case "10d":
        case "10n":
            return rain_icon;
        case "13d":
        case "13n":
            return snow_icon;
        default:
            return clear_icon;
    }
  }

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      let defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&units=Metric&appid=${api_key}`;

      try {
        let defaultResponse = await fetch(defaultUrl);
        let defaultData = await defaultResponse.json();
        setWeatherData({
          temperature: Math.floor(defaultData.main.temp),
          location: defaultData.name,
          humidity: defaultData.main.humidity,
          windSpeed: Math.floor(defaultData.wind.speed)
        });
        setWeatherIcon(getWeatherIcon(defaultData.weather[0].icon));
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
    fetchDefaultWeather();
  }, [api_key]);

  if(!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
        <div className='top-bar'>
            <input 
              type='text' 
              className='cityInput' 
              placeholder='Search' 
              ref={inputRef}
              onKeyDown={handleKeyDown} 
            />
            <div className='search-icon' onClick={handleSearch}>
                <img src={search_icon} alt='search icon' />
            </div>
        </div>
        <div className='weather-image'>
          <img src={weathericon} alt='weather icon' />
        </div>
        <div className='weather-temp'>{weatherData.temperature}°C</div>
        <div className='weather-location'>{weatherData.location}</div>
        <div className='data-container'>
          <div className='element'>
            <img src={humidity_icon} alt='' className='icon' />
            <div className='data'>
              <div className='humidity-percent'>{weatherData.humidity}%</div>
              <div className='text'>Humidity</div>
            </div>
          </div>

          <div className='element'>
            <img src={wind_icon} alt='' className='icon' />
            <div className='data'>
              <div className='wind-rate'>{weatherData.windSpeed} km/h</div>
              <div className='text'>Wind Speed</div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default WeatherApp;

