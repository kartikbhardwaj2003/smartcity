// frontend/src/services/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const API_BASE = `${BASE.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

// Attach token if present
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
