import React from 'react';
import WeatherReport from './components/WeatherReport';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container>
      <h1>Current Weather</h1>
      <WeatherReport />
    </Container>
  );
};

export default App;
