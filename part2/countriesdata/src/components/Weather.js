import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    weatherService.get(country.name.common).then((resp) => {
      const weatherObj = {
        speed: resp.wind.speed,
        temperature: (resp.main.temp - 273.15).toFixed(1),
        icon: resp.weather[0].icon,
      };

      setWeather(weatherObj);
    });
  }, []);

  if (Object.keys(weather).length === 0) return;

  return (
    <div>
      <h2>Weather in {country.name.common}</h2>

      <div>
        temperature {weather.temperature} <span>&deg;C</span>
      </div>

      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" />

      <div>wind {weather.speed} m/s</div>
    </div>
  );
};

export default Weather;
