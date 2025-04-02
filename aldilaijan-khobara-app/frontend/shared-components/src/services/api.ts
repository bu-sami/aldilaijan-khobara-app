import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => 
    api.post('/auth/reset-password', { token, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (userData) => 
    api.put('/auth/profile', userData),
};

// Users API
export const usersAPI = {
  getAll: (params) => 
    api.get('/users', { params }),
  
  getById: (id) => 
    api.get(`/users/${id}`),
  
  create: (userData) => 
    api.post('/users', userData),
  
  update: (id, userData) => 
    api.put(`/users/${id}`, userData),
  
  delete: (id) => 
    api.delete(`/users/${id}`),
  
  getRoles: () => 
    api.get('/users/roles'),
};

// Locations API
export const locationsAPI = {
  getAll: (params) => 
    api.get('/locations', { params }),
  
  getById: (id) => 
    api.get(`/locations/${id}`),
  
  create: (locationData) => 
    api.post('/locations', locationData),
  
  update: (id, locationData) => 
    api.put(`/locations/${id}`, locationData),
  
  delete: (id) => 
    api.delete(`/locations/${id}`),
};

export default api;
