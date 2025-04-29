import api from './api';

// Get all tags
export const getTags = async () => {
    try {
        const response = await api.get('/tags');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch tags' };
    }
};

// Create a new tag
export const createTag = async (name) => {
    try {
        const response = await api.post('/tags', { name });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create tag' };
    }
};

// Update a tag
export const updateTag = async (id, name) => {
    try {
        const response = await api.patch(`/tags/${id}`, { name });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update tag' };
    }
};

// Delete a tag
export const deleteTag = async (id) => {
    try {
        await api.delete(`/tags/${id}`);
        return true;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete tag' };
    }
};