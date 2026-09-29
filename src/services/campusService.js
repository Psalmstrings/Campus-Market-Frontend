import api from './api';

export const getCampuses = async (all = false) => {
  const response = await api.get(`/api/campuses${all ? '?all=true' : ''}`);
  return response.data;
};

export const getCampusById = async (id) => {
  const response = await api.get(`/api/campuses/${id}`);
  return response.data;
};

export const createCampus = async (campusData) => {
  const response = await api.post('/api/campuses', campusData);
  return response.data;
};

export const updateCampus = async (id, campusData) => {
  const response = await api.put(`/api/campuses/${id}`, campusData);
  return response.data;
};

export const deleteCampus = async (id) => {
  const response = await api.delete(`/api/campuses/${id}`);
  return response.data;
};
