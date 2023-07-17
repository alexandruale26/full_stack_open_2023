import axios from "axios";

const baseUrl = "http://localhost:3003/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newContact) => {
  const request = axios.post(baseUrl, newContact);
  return request.then((response) => response.data);
};

const updateNumber = (id, updatedContact) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedContact);
  return request.then((response) => response.data);
};

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, remove, updateNumber };
