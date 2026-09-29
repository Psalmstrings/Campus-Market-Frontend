import api from './api';

export const getCategories = async (all = false) => {
  const response = await api.get(`/api/categories${all ? '?all=true' : ''}`);
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/api/categories/slug/${slug}`);
  return response.data;
};

export const createCategory = async (catData) => {
  const response = await api.post('/api/categories', catData);
  return response.data;
};

export const updateCategory = async (id, catData) => {
  const response = await api.put(`/api/categories/${id}`, catData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};
