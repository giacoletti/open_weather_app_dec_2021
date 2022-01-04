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
  Grid,
  CircularProgress,
  Chip,
  Button,
  TextField
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const WeatherReport = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearch, setCitySearch] = useState();

  const getUserLocationAndWeather = async () => {
    const geolocationResponse = await Geolocation.getCoordinates();
    if (geolocationResponse.latitude) {
      getWeatherReport(geolocationResponse.latitude, geolocationResponse.longitude)
    }
  };

  const getWeatherReport = async (latitude, longitude) => {
    let city, temperature, feelsLike, icon, description, updateTime,
      humidity, windSpeed;

    const openCageResponse = await OpenCageAPI.getCity(
      latitude,
      longitude
    );

    if (openCageResponse.components.hamlet) {
      city = openCageResponse.components.hamlet + ` ${openCageResponse.annotations.flag}`;
    } else if (openCageResponse.components.town) {
      city = openCageResponse.components.town + ` ${openCageResponse.annotations.flag}`;
    } else {
      city = openCageResponse.components.city + ` ${openCageResponse.annotations.flag}`;
    }

    const openWeatherResponse = await OpenWeatherAPI.getCurrentAndForecastWeather(
      latitude,
      longitude
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

  const handleCityChange = (event) => {
    setCitySearch(event.target.value);
  };

  const searchCityWeather = async () => {
    const openCageResponse = await OpenCageAPI.getCoordinates(citySearch);
    if (openCageResponse.lat) {
      getWeatherReport(openCageResponse.lat, openCageResponse.lng);
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
              { !showCitySearch ?
                <Button data-cy="change-city-btn"
                  onClick={()=>{setShowCitySearch(true)}} variant="contained">Change city</Button> :
                <>
                  <TextField data-cy="search-input-city" sx={{ maxWidth: '200px' }}
                    onChange={handleCityChange} size="small" label="Enter a city" />
                  <Button data-cy="search-city-btn" onClick={searchCityWeather}
                    variant="contained">Search</Button>
                </>
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
