import axios from 'axios';

const OpenWeatherAPI = {
  endpointUrl: 'https://api.openweathermap.org/data/2.5/onecall',

  getCurrentAndForecastWeather(latitude, longitude) {
    return async (dispatch) => {
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
        dispatch({ type: 'SET_WEATHER_INFO', payload: response.data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: error.message });
      }
    };
  }
};

export default OpenWeatherAPI;
