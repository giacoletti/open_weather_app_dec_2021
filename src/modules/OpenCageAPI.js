import axios from 'axios';

const OpenCageAPI = {
  endpointUrl: 'https://api.opencagedata.com/geocode/v1/json',
  async getCity(latitude, longitude) {
    try {
      const response = await axios.get(this.endpointUrl, {
        params: {
          q: `${latitude}+${longitude}`,
          key: process.env.REACT_APP_OPEN_CAGE_API_KEY
        }
      });
      return response.data.results[0];
    } catch (error) {
      return error;
    }
  },
  async getCoordinates(city) {
    try {
      const response = await axios.get(this.endpointUrl, {
        params: {
          q: city,
          key: process.env.REACT_APP_OPEN_CAGE_API_KEY
        }
      });
      return response.data.results[0].geometry;
    } catch (error) {
      return error;
    }
  }
};

export default OpenCageAPI;
