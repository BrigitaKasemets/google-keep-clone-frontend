import api from './api';

// Get all notes
export const getNotes = async () => {
    try {
        const response = await api.get('/notes');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch notes' };
    }
};

// Create a new note
export const createNote = async (noteData) => {
    try {
        const response = await api.post('/notes', noteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create note' };
    }
};

// Update an existing note
export const updateNote = async (id, noteData) => {
    try {
        const response = await api.patch(`/notes/${id}`, noteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update note' };
    }
};

// Delete a note
export const deleteNote = async (id) => {
    try {
        await api.delete(`/notes/${id}`);
        return true;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete note' };
    }
};