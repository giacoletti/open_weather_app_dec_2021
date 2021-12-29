import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';
import OpenWeatherAPI from '../modules/OpenWeatherAPI';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getUserLocationAndWeather = async () => {
    let city, temperature;
    const geolocationResponse = await Geolocation.getCoordinates();
    if (geolocationResponse.latitude) {
      const openCageResponse = await OpenCageAPI.getCity(
        geolocationResponse.latitude,
        geolocationResponse.longitude
      );

      if (openCageResponse.hamlet) {
        city = openCageResponse.hamlet;
      } else {
        city = openCageResponse.city;
      }

      const openWeatherResponse = await OpenWeatherAPI.getCurrentAndForecastWeather(
        geolocationResponse.latitude,
        geolocationResponse.longitude
      );

      if (openWeatherResponse.current) {
        temperature = parseFloat(openWeatherResponse.current.temp.toFixed(1));
        temperature = `${temperature}°C`;
      }
      setWeatherInfo({ city: city, temperature: temperature });
    }
  };

  useEffect(() => {
    getUserLocationAndWeather();
  }, []);

  return (
    <div>
      <h2 data-cy="weather-city">{weatherInfo.city}</h2>
      <h2 data-cy="weather-temperature">{weatherInfo.temperature}</h2>
    </div>
  );
};

export default WeatherReport;
