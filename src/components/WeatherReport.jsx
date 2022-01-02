import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';
import OpenWeatherAPI from '../modules/OpenWeatherAPI';
import TimeParser from '../modules/TimeParser';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  CircularProgress
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getUserLocationAndWeather = async () => {
    let city, temperature, icon, description, updateTime;
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
        updateTime = TimeParser.unixToClockTime(openWeatherResponse.current.dt);
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
        updateTime,
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
    <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
      <CardContent>
      {!weatherInfo.city ? (
        <Grid>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Typography variant="caption" display="block" align="right">
            {weatherInfo.updateTime}
          </Typography>
          <Grid container alignItems="center">
            <Grid item xs="auto">
              <Avatar aria-label="city">
                <LocationCityIcon />
              </Avatar>
            </Grid>
            <Grid item xs sx={{ paddingLeft: '5px' }}>
              <h1 data-cy="weather-city" style={{ fontWeight: 400 }}>
               {weatherInfo.city}
              </h1>
            </Grid>
          </Grid>
        </>
      )}
      {!weatherInfo.temperature ? (
        <Grid>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container alignItems="center">
            <Grid item xs="auto">
              <img data-cy="weather-icon" src={weatherInfo.icon} alt="" />
            </Grid>
            <Grid item xs>
              <Typography data-cy="weather-description" variant="h5" component="div">
                {weatherInfo.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs="auto">
              <ThermostatIcon data-cy="temperature-icon"/>
            </Grid>
            <Grid item xs>
              <h3 data-cy="weather-temperature">{weatherInfo.temperature}</h3>
            </Grid>
          </Grid>
        </>
      )}
      </CardContent>
    </Card>
  );
};

export default WeatherReport;
