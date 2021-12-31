const TimeParser = {
  unixToClockTime(unixTime) {
    const milliseconds = unixTime * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });

    return humanDateFormat;
  }
};

export default TimeParser;
