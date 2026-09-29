import api from './api';

export const getListings = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const response = await api.get(`/api/listings?${query.toString()}`);
  return response.data;
};

export const getListingById = async (id) => {
  const response = await api.get(`/api/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/api/listings', listingData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/api/listings/${id}`, listingData);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/api/listings/${id}`);
  return response.data;
};

export const markListingSold = async (id) => {
  const response = await api.patch(`/api/listings/${id}/sold`);
  return response.data;
};

export const toggleFavorite = async (id) => {
  const response = await api.patch(`/api/listings/${id}/favorite`);
  return response.data;
};

export const recordWhatsappClick = async (id) => {
  const response = await api.patch(`/api/listings/${id}/whatsapp-click`);
  return response.data;
};

export const recordPhoneClick = async (id) => {
  const response = await api.patch(`/api/listings/${id}/phone-click`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get('/api/listings/user/my-listings');
  return response.data;
};

export const getMyFavorites = async () => {
  const response = await api.get('/api/listings/user/favorites');
  return response.data;
};

export const uploadImages = async (formData) => {
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
