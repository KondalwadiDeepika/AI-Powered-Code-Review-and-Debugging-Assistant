import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
};

export const reviewAPI = {
  submit: (code) => API.post('/review', { code }),
  history: () => API.get('/review/history'),
  analytics: () => API.get('/review/analytics'),
};

export default API;
