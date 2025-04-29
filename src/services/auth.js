import api from './api';

// Register a new user
export const register = async (username, password) => {
    try {
        console.log('Registering user:', { username, password });
        const response = await api.post('/users', { username, password });
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Registration failed' };
    }
};

// Login a user and store the JWT token
export const login = async (username, password) => {
    try {
        console.log('Logging in user:', { username });
        const response = await api.post('/sessions', { username, password });
        console.log('Login response:', response.data);

        const { token } = response.data;

        if (!token) {
            throw new Error('No token received from server');
        }

        // Store the token in localStorage
        localStorage.setItem('token', token);

        return token;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Login failed' };
    }
};

// Logout the user by removing the token and calling the API
export const logout = async () => {
    try {
        await api.delete('/sessions');
        localStorage.removeItem('token');
        return true;
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
        // Even if the API call fails, we should remove the token
        localStorage.removeItem('token');
        return false;
    }
};

// Check if the user is logged in
export const isAuthenticated = () => {
    return Boolean(localStorage.getItem('token'));
};