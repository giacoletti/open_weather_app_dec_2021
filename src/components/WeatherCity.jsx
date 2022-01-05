import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid } from '@mui/material';

const WeatherCity = () => {
  const { weatherCity, weatherInfo } = useSelector(state => state);

  return (
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
  );
};

export default WeatherCity;
