import axios from 'axios';

// Resolve base API URL (supports Vite proxy in dev, same-origin in production, or explicit VITE_API_URL)
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusmarket_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('campusmarket_token')) {
        localStorage.removeItem('campusmarket_token');
        localStorage.removeItem('campusmarket_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
