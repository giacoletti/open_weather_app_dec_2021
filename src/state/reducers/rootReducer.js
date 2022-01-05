import TimeParser from '../../modules/TimeParser';
import { parseTemperature } from '../../modules/utils';

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      let city;

      if (action.payload.components.hamlet) {
        city = action.payload.components.hamlet + ` ${action.payload.annotations.flag}`;
      } else if (action.payload.components.town) {
        city = action.payload.components.town + ` ${action.payload.annotations.flag}`;
      } else {
        city = action.payload.components.city + ` ${action.payload.annotations.flag}`;
      }

      return {
        ...state,
        weatherCity: city
      };
    case 'SET_WEATHER_INFO':
      let temperature, feelsLike, icon, description,
        updateTime, humidity, windSpeed;

      updateTime = TimeParser.unixToClockTime(action.payload.current.dt);
      temperature = parseTemperature(action.payload.current.temp);
      feelsLike = parseTemperature(action.payload.current.feels_like);
      icon =
        'https://openweathermap.org/img/wn/' +
        action.payload.current.weather[0].icon +
        '.png';
      description = action.payload.current.weather[0].description;
      description = description.charAt(0).toUpperCase() + description.slice(1);
      humidity = action.payload.current.humidity + '%';
      windSpeed = action.payload.current.wind_speed + ' m/sec';

      return {
        ...state,
        weatherInfo: {
          updateTime,
          temperature,
          feelsLike,
          icon,
          description,
          humidity,
          windSpeed
        }
      };
    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
