import axios from "axios";

const api_key = process.env.REACT_APP_API_KEY;

const baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const get = (city) => {
  const request = axios.get(`${baseUrl}${city}&appid=${api_key}`);
  return request.then((response) => response.data);
};

export default { get };
