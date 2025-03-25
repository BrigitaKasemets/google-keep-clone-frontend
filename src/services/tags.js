import api from './api';

export const getAllTags = async () => {
  const response = await api.get('/tags');
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await api.post('/tags', tagData);
  return response.data;
};

export const updateTag = async (tagId, tagData) => {
  const response = await api.patch(`/tags/${tagId}`, tagData);
  return response.data;
};

export const deleteTag = async (tagId) => {
  await api.delete(`/tags/${tagId}`);
};
