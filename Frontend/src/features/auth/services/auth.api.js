import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const register = async (username, email, password) => {
  try {
    const response = await api.post(
      `/register`,
      { username, email, password }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post(
      `/login`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post(`/logout`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get(`/get-me`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};