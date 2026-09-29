import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||'https://campusmarket-backend-i99x.onrender.com' || 'http://localhost:5006',
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
