import axios from 'axios';

const getApiBaseUrl = () => {
  // Use same origin if served via Vite proxy; fallback to explicit env
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/auth/profile')
};

// Rooms API
export const roomsAPI = {
  createRoom: (roomData) => 
    api.post('/rooms', roomData),
  
  getRooms: () => 
    api.get('/rooms'),
  
  getRoom: (roomId) => 
    api.get(`/rooms/${roomId}`),
  
  joinRoom: (roomId) => 
    api.post(`/rooms/${roomId}/join`)
};

export default api;
