import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000 // 10s pour éviter les bugs de chargement
});

export default api;
