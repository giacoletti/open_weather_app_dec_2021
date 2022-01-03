export function parseTemperature(temp) {
  const temperature = parseFloat(temp.toFixed(1));
  return `${temperature}°C`;
};
