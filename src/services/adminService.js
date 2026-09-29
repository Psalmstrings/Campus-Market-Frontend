import api from './api';

// Helper: strip undefined/null/empty-string values before building query string
const buildQuery = (params = {}) => {
  const clean = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'undefined') {
      clean[k] = v;
    }
  });
  return new URLSearchParams(clean).toString();
};

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const query = buildQuery(params);
  const response = await api.get(`/api/admin/users${query ? `?${query}` : ''}`);
  return response.data;
};

export const updateAdminUser = async (id, data) => {
  const response = await api.patch(`/api/admin/users/${id}`, data);
  return response.data;
};

export const getAdminListings = async (params = {}) => {
  const query = buildQuery(params);
  const response = await api.get(`/api/admin/listings${query ? `?${query}` : ''}`);
  return response.data;
};

export const approveListing = async (id) => {
  const response = await api.patch(`/api/admin/listings/${id}/approve`);
  return response.data;
};

export const rejectListing = async (id) => {
  const response = await api.patch(`/api/admin/listings/${id}/reject`);
  return response.data;
};

export const toggleFeatureListing = async (id) => {
  const response = await api.patch(`/api/admin/listings/${id}/feature`);
  return response.data;
};
