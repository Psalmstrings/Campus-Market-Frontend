import api from './api';

export const submitReport = async (reportData) => {
  const response = await api.post('/api/reports', reportData);
  return response.data;
};

export const getReports = async (status = '') => {
  const query = status ? `?status=${status}` : '';
  const response = await api.get(`/api/reports${query}`);
  return response.data;
};

export const updateReportStatus = async (id, data) => {
  const response = await api.patch(`/api/reports/${id}`, data);
  return response.data;
};
