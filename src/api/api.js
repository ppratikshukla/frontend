import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'https://backend-site-env.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendapp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('attendapp_token');
      localStorage.removeItem('attendapp_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const subjectAPI = {
  getDashboard: () => API.get('/subjects/dashboard'),
  getAll: () => API.get('/subjects'),
  add: (data) => API.post('/subjects', data),
  remove: (id) => API.delete(`/subjects/${id}`),
  markAttendance: (id, data) => API.post(`/subjects/${id}/mark`, data),
  getLogs: (id) => API.get(`/subjects/${id}/logs`),
};

export default API;
