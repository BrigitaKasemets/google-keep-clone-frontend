import api from './api';

export const getAllNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (noteId, noteData) => {
  const response = await api.patch(`/notes/${noteId}`, noteData);
  return response.data;
};

export const deleteNote = async (noteId) => {
  await api.delete(`/notes/${noteId}`);
};
