import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, register, updateUserDetails, isLoggedIn } from '../services/auth';
import { jwtDecode } from 'jwt-decode';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Helper function to decode JWT and extract user info
const getUserFromToken = (token) => {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return {
            id: decoded.id,
            username: decoded.username,
            authenticated: true
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

// Provider component that wraps the app and makes auth available to any child component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check authentication status when the component mounts
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const user = getUserFromToken(token);
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login function
    const handleLogin = async (username, password) => {
        try {
            setError('');
            setLoading(true);
            const token = await login(username, password);
            const user = getUserFromToken(token);
            setCurrentUser(user);
            return true;
        } catch (error) {
            setError(error.message || 'Failed to log in');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const handleRegister = async (username, password) => {
        try {
            setError('');
            setLoading(true);
            await register(username, password);
            // Automatically log in after successful registration
            return await handleLogin(username, password);
        } catch (error) {
            setError(error.message || 'Failed to register');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setCurrentUser(null);
            return true;
        } catch (error) {
            setError(error.message || 'Failed to log out');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update user details
    const handleUpdateUserDetails = async (userData) => {
        if (!currentUser || !currentUser.id) {
            setError('You must be logged in to update your details');
            return false;
        }

        try {
            setError('');
            setLoading(true);
            await updateUserDetails(currentUser.id, userData);

            // If username was updated, update the current user state
            if (userData.username) {
                setCurrentUser(prev => ({
                    ...prev,
                    username: userData.username
                }));
            }

            // If password was changed, we don't need to update state
            return true;
        } catch (error) {
            setError(error.message || 'Failed to update user details');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Create the value object that will be provided to consumers
    const value = {
        currentUser,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUserDetails: handleUpdateUserDetails,
        isAuthenticated: () => Boolean(currentUser)
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};