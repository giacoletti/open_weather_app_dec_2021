import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getUserLocation = async () => {
    const geolocationResponse = await Geolocation.getCoordinates();
    if (geolocationResponse.latitude) {
      const openCageResponse = await OpenCageAPI.getCity(
        geolocationResponse.latitude,
        geolocationResponse.longitude
      );

      if (openCageResponse.hamlet) {
        setWeatherInfo({ city: openCageResponse.hamlet });
      } else {
        setWeatherInfo({ city: openCageResponse.city });
      }
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div>
      <h2 data-cy="weather-city">{weatherInfo.city}</h2>
    </div>
  );
};

export default WeatherReport;
