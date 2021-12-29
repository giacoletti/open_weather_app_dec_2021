import axios from 'axios';

const OpenWeatherAPI = {
  endpointUrl: 'https://api.openweathermap.org/data/2.5/onecall',

  async getCurrentAndForecastWeather(latitude, longitude) {
    try {
      const response = await axios.get(this.endpointUrl, {
        params: {
          lat: latitude,
          lon: longitude,
          exclude: 'minutely',
          units: 'metric',
          appid: process.env.REACT_APP_OPEN_WEATHER_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
};

export default OpenWeatherAPI;
