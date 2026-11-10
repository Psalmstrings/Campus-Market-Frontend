import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/api/auth/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/api/auth/change-password', passwordData);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.post('/api/auth/verify-email', { token });
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post('/api/auth/resend-verification', { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, passwordData) => {
  const response = await api.post(`/api/auth/reset-password/${token}`, passwordData);
  return response.data;
};
