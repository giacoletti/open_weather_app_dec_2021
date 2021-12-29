import React from 'react';
import WeatherReport from './components/WeatherReport';
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-3">Current Weather</h1>
      <WeatherReport />
    </Container>
  );
};

export default App;
