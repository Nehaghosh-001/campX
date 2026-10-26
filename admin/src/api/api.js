import axios from 'axios';

// Determine API base URL dynamically:
// In production (e.g. Render / Vercel), set VITE_API_URL in Environment Variables.
// In local development, defaults to 'http://127.0.0.1:8000/api'.
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://127.0.0.1:8000/api';
  }
  let formatted = envUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }
  return formatted.endsWith('/api') ? formatted : `${formatted.replace(/\/$/, '')}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => apiClient.post('/accounts/login/', data),
  demoLogin: (role) => apiClient.post('/accounts/demo-login/', { role }),
  getProfile: () => apiClient.get('/accounts/me/'),
};

export const collegeApi = {
  list: (params) => apiClient.get('/colleges/', { params }),
  get: (id) => apiClient.get(`/colleges/${id}/`),
  apply: (data) => apiClient.post('/colleges/apply/', data),
  approve: (id, data) => apiClient.post(`/colleges/${id}/approve/`, data),
  getPlatformStats: () => apiClient.get('/colleges/platform-stats/'),
};

export const studentApi = {
  listStudents: (params) => apiClient.get('/students/', { params }),
  getStudent: (id) => apiClient.get(`/students/${id}/`),
};

export const companyApi = {
  list: (params) => apiClient.get('/companies/', { params }),
  verify: (id, data) => apiClient.post(`/companies/${id}/verify/`, data),
};

export const driveApi = {
  list: (params) => apiClient.get('/drives/', { params }),
  get: (id) => apiClient.get(`/drives/${id}/`),
};

export const placementApi = {
  list: (params) => apiClient.get('/placements/', { params }),
};

export default apiClient;
