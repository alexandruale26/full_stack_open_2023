import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all/";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((countries) => countries.data);
};

export default { getAll };
