import axios from "axios";
import { toast } from "sonner";

// Set your API base URL here
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle response errors
      const message = error.response.data?.detail || "An error occurred";
      toast.error(message);
    } else if (error.request) {
      // Handle request errors
      toast.error("No response from server. Please try again later.");
    } else {
      // Handle other errors
      toast.error("An error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;