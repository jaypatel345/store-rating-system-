import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string; address: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const usersAPI = {
  create: (data: { name: string; email: string; password: string; address: string; role: string }) =>
    api.post('/users', data),
  getAll: (params?: { name?: string; email?: string; address?: string; role?: string; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }) =>
    api.get('/users', { params }),
  getStats: () => api.get('/users/stats'),
  getById: (id: string) => api.get(`/users/${id}`),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/password', data),
};

export const storesAPI = {
  create: (data: { name: string; email: string; address: string; ownerId: string }) =>
    api.post('/stores', data),
  getAll: (params?: { name?: string; address?: string; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }) =>
    api.get('/stores', { params }),
  getById: (id: string) => api.get(`/stores/${id}`),
};

export const ratingsAPI = {
  create: (data: { rating: number; storeId: string }) =>
    api.post('/ratings', data),
  update: (id: string, data: { rating: number; storeId: string }) =>
    api.put(`/ratings/${id}`, data),
  getByStore: (storeId: string) => api.get(`/ratings/store/${storeId}`),
  getStoreAverage: (storeId: string) => api.get(`/ratings/store/${storeId}/average`),
  getOwnerDashboard: () => api.get('/ratings/owner/dashboard'),
  getByUser: () => api.get('/ratings/user'),
};

export default api;
