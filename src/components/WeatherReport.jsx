import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';
import OpenWeatherAPI from '../modules/OpenWeatherAPI';
import { Card, Image, Badge } from 'react-bootstrap';
import { Thermometer, HouseFill } from 'react-bootstrap-icons';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getUserLocationAndWeather = async () => {
    let city, temperature, icon, description;
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
        icon =
          'https://openweathermap.org/img/wn/' +
          openWeatherResponse.current.weather[0].icon +
          '.png';
        description = openWeatherResponse.current.weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1);
      }
      setWeatherInfo({
        city,
        temperature,
        icon,
        description
      });
    }
  };

  useEffect(() => {
    getUserLocationAndWeather();
  }, []);

  return (
    <Card
      style={{ width: '20rem' }}
      className="shadow p-2 mb-5 bg-body rounded"
    >
      <Card.Body>
        <h4 data-cy="weather-city">
          <Badge pill bg="light" text="dark"><HouseFill /></Badge>
          &nbsp;{weatherInfo.city}
        </h4>
        <Card.Title><Image src={weatherInfo.icon} />{weatherInfo.description}</Card.Title>
        <Card.Title data-cy="weather-temperature">
          <Thermometer />
          {weatherInfo.temperature}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default WeatherReport;
