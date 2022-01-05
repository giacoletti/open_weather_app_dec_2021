import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Geolocation from '../modules/Geolocation';
import OpenCageAPI from '../modules/OpenCageAPI';
import OpenWeatherAPI from '../modules/OpenWeatherAPI';
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
import ErrorMessage from './ErrorMessage';

const WeatherReport = () => {
  const dispatch = useDispatch();
  const { weatherCity, weatherInfo, errorMessage } = useSelector(state => state);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearch, setCitySearch] = useState();

  const getUserLocationAndWeather = async () => {
    const geolocationResponse = await Geolocation.getCoordinates();
    if (geolocationResponse.message) {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: geolocationResponse.message });
    } else {
      getWeatherReport(geolocationResponse.latitude, geolocationResponse.longitude)
    }
  };

  const getWeatherReport = async (latitude, longitude) => {
    dispatch(OpenCageAPI.getCity(latitude,longitude));

    dispatch(OpenWeatherAPI.getCurrentAndForecastWeather(
        latitude,
        longitude
      ));
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
      { errorMessage ? 
        <ErrorMessage message={errorMessage} /> :
        <CardContent>
        {!weatherCity ? (
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
                 {weatherCity}
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
      }
    </Card>
  );
};

export default WeatherReport;
