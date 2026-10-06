import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sesa_token');
  if (token && token.indexOf('mock') === -1) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.config.url !== '/auth/login') {
        localStorage.removeItem('sesa_token');
        localStorage.removeItem('sesa_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
