export const fetchLocationIdByCoord = async (lat, long) => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/search/?lattlong=${long},${lat}`,
  );
  const locations = await response.json();
  return locations[0].woeid;
};

export const fetchLocationId = async city => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/search/?query=${city}`,
  );
  const locations = await response.json();
  return locations[0].woeid;
};

export const fetchWeather = async woeid => {
  const response = await fetch(
    `https://www.metaweather.com/api/location/${woeid}/`,
  );
  const { title, consolidated_weather } = await response.json();
  const { weather_state_name, the_temp, wind_speed, humidity } = consolidated_weather[0];

  return {
    location: title,
    weather: weather_state_name,
    temperature: the_temp,
    wind: wind_speed,
    humidity: humidity,
  };
};
