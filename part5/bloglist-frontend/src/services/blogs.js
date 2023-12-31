import axios from "axios";

let token = null;
const baseUrl = "/api/blogs";

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const createConfig = () => {
  return {
    headers: {
      Authorization: token,
    },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl, createConfig());
  return response.data;
};

const create = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, createConfig());
  return response.data;
};

const update = async (id, blog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog, createConfig());
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, createConfig());
  return response.data;
};

export default { setToken, getAll, create, update, remove };
