import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';

const WeatherReport = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: ''
  });

  const getUserCoordinates = async () => {
    const response = await Geolocation.getCoordinates();
    if (response.latitude) {
      setCoordinates({
        latitude: response.latitude,
        longitude: response.longitude
      });
    }
  };

  useEffect(() => {
    getUserCoordinates();
  }, []);

  return (
    <div>
      <h2 data-cy="user-latitude">Your latitude is: {coordinates.latitude}</h2>
      <h2 data-cy="user-longitude">
        Your longitude is: {coordinates.longitude}
      </h2>
    </div>
  );
};

export default WeatherReport;
