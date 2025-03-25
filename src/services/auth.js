import api from './api';

export const registerUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/sessions', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logoutUser = async () => {
  await api.delete('/sessions');
  localStorage.removeItem('token');
};

export const updateUser = async (userId, userData) => {
  const response = await api.patch(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
  localStorage.removeItem('token');
};

// Kontrollib tokeni olemasolu ja tagastab kasutaja andmed JWT-st
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Parsib JWT tokeni, et saada kasutaja ID ja nimi
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      id: payload.id,
      username: payload.username
    };
  } catch (e) {
    console.error('Tokeni parsimine ebaõnnestus:', e);
    localStorage.removeItem('token');
    return null;
  }
};
