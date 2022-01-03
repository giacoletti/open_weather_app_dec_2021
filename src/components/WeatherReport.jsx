import React, { useEffect, useState } from 'react';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';
import OpenWeatherAPI from '../modules/OpenWeatherAPI';
import TimeParser from '../modules/TimeParser';
import { parseTemperature } from '../modules/utils';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [showCitySearch, setShowCitySearch] = useState(false);

  const getUserLocationAndWeather = async () => {
    let city, temperature, feelsLike, icon, description, updateTime,
      humidity, windSpeed;
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
        temperature = parseTemperature(openWeatherResponse.current.temp);
        feelsLike = parseTemperature(openWeatherResponse.current.feels_like);
        icon = 'https://openweathermap.org/img/wn/' +
          openWeatherResponse.current.weather[0].icon +
          '.png';
        description = openWeatherResponse.current.weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1);
        humidity = openWeatherResponse.current.humidity + '%';        
        windSpeed = openWeatherResponse.current.wind_speed + ' m/sec';        
      }
      setWeatherInfo({
        updateTime,
        city,
        temperature,
        feelsLike,
        icon,
        description,
        humidity,
        windSpeed
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
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <Avatar aria-label="city">
                <LocationCityIcon />
              </Avatar>
            </Grid>
            <Grid item sx={{ paddingLeft: '5px' }}>
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
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <img data-cy="weather-icon" src={weatherInfo.icon} alt="" />
            </Grid>
            <Grid item>
              <Typography data-cy="weather-description" variant="h5" component="div">
                {weatherInfo.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <ThermostatIcon data-cy="temperature-icon"/>
            </Grid>
            <Grid item>
              <h3 data-cy="weather-temperature">
                {weatherInfo.temperature} <Chip data-cy="weather-feels-like" label={`Feels like: ${weatherInfo.feelsLike}`} />
              </h3>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="center" spacing={1}>
            <Grid item>
              <Chip data-cy="weather-humidity" 
                label={`Humidity: ${weatherInfo.humidity}`} />
            </Grid>
            <Grid item>
              <Chip data-cy="weather-wind-speed"  
                label={`Wind speed: ${weatherInfo.windSpeed}`} />
            </Grid>
            <Grid item sx={{ margin: 'auto', marginTop: '14px' }}>
              { !showCitySearch &&
                <Button data-cy="change-city-btn"
                  onClick={()=>{setShowCitySearch(true)}} variant="contained">Change city</Button>
              }
            </Grid>
          </Grid>
        </>
      )}
      </CardContent>
    </Card>
  );
};

export default WeatherReport;
