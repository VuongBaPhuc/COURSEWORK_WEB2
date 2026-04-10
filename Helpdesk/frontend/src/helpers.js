import axios from "axios";

const API_BASE = "http://localhost:3001/api";

// Configure axios to include auth headers
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user._id) {
    config.headers['user-id'] = user._id;
  }
  return config;
});

// Auth API
export const login = (credentials) => axios.post(`${API_BASE}/auth/login`, credentials);
export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Issues API
export const getIssues = () => axios.get(`${API_BASE}/issues`);
export const searchIssues = (query) => axios.get(`${API_BASE}/issues/search`, { params: query });
export const createIssue = (data) => axios.post(`${API_BASE}/issues`, data);
export const updateIssue = (id, data) => axios.put(`${API_BASE}/issues/${id}`, data);
export const deleteIssue = (id) => axios.delete(`${API_BASE}/issues/${id}`);
export const getIssue = (id) => axios.get(`${API_BASE}/issues/${id}`);
export const getCategories = () => axios.get(`${API_BASE}/issues/categories`);

// Users API (Admin only)
export const getUsers = () => axios.get(`${API_BASE}/users`);
export const createUser = (data) => axios.post(`${API_BASE}/users`, data);
export const updateUser = (id, data) => axios.put(`${API_BASE}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_BASE}/users/${id}`);

// Messages API
export const sendMessage = (data) => axios.post(`${API_BASE}/messages`, data);
export const getMessages = () => axios.get(`${API_BASE}/messages`);
export const replyMessage = (id, replyContent) => axios.put(`${API_BASE}/messages/${id}/reply`, { replyContent });
export const markMessageAsRead = (id) => axios.put(`${API_BASE}/messages/${id}/read`);
export const getUnreadCount = () => axios.get(`${API_BASE}/messages/unread`);

// Utility functions
export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('getCurrentUser:', user); // Debug log
  return user;
};
export const isAuthenticated = () => {
  const auth = !!getCurrentUser();
  console.log('isAuthenticated:', auth); // Debug log
  return auth;
};
export const hasRole = (role) => {
  const user = getCurrentUser();
  const hasIt = user && user.role === role;
  console.log('hasRole(' + role + '):', hasIt); // Debug log
  return hasIt;
};
export const isAdmin = () => hasRole('admin');
export const isEmployee = () => hasRole('employee');
export const isCustomer = () => hasRole('customer');
