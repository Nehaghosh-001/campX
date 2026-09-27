import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          if (res.data.access) {
            localStorage.setItem('access_token', res.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints (Password & Roll Number Based, No OTPs)
export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  studentSignup: (data) => api.post('/auth/student-signup/', data),
  forgotPassword: (data) => api.post('/auth/forgot-password/', data),
  resetPassword: (data) => api.post('/auth/reset-password/', data),
  demoLogin: (role) => api.post('/auth/demo-login/', { role }),
  getMe: () => api.get('/auth/me/'),
  updateProfile: (data) => api.put('/auth/me/', data),
};

// Colleges Endpoints
export const collegeApi = {
  list: (params) => api.get('/colleges/', { params }),
  apply: (data) => api.post('/colleges/apply/', data),
  approve: (id, data) => api.post(`/colleges/${id}/approve/`, data),
  getPlatformStats: () => api.get('/colleges/platform-stats/'),
};

// Students Endpoints
export const studentApi = {
  getProfile: () => api.get('/students/profile/'),
  updateProfile: (data) => api.put('/students/profile/', data),
  getEligibleDrives: () => api.get('/students/drives/'),
  getApplicationsTracker: () => api.get('/students/applications/'),
  getPlacementHistory: () => api.get('/students/placement-history/'),
  listStudents: (params) => api.get('/students/list/', { params }),
};

// Companies Endpoints
export const companyApi = {
  list: (params) => api.get('/companies/', { params }),
  register: (data) => api.post('/companies/register/', data),
  verify: (id, data) => api.post(`/companies/${id}/verify/`, data),
};

// Drives Endpoints
export const driveApi = {
  list: (params) => api.get('/drives/', { params }),
  get: (id) => api.get(`/drives/${id}/`),
  create: (data) => api.post('/drives/', data),
  update: (id, data) => api.put(`/drives/${id}/`, data),
  getEligibleStudents: (id) => api.get(`/drives/${id}/eligible-students/`),
  apply: (id) => api.post(`/drives/${id}/apply/`),
  createRound: (id, data) => api.post(`/drives/${id}/rounds/`, data),
  getRoundStudents: (roundId) => api.get(`/drives/rounds/${roundId}/students/`),
  updateRoundResults: (roundId, data) => api.post(`/drives/rounds/${roundId}/results/`, data),
  publishFinalList: (driveId, data) => api.post(`/drives/${driveId}/publish-final-list/`, data),
};

// Placements & TPO Stats
export const placementApi = {
  list: (params) => api.get('/placements/', { params }),
  getTpoStats: (params) => api.get('/placements/tpo-stats/', { params }),
};

// Notifications
export const notificationApi = {
  list: () => api.get('/notifications/'),
  markRead: (id) => api.post('/notifications/', { notification_id: id }),
};

export default api;
