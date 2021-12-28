const Geolocation = {
  async getCoordinates() {
    try {
      const response = await this.getPosition();
      return response.coords;
    } catch (error) {
      return error;
    }
  },
  getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true
      });
    });
  }
};

export default Geolocation;
