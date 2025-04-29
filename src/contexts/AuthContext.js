import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, login, logout, register } from '../services/auth';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth available to any child component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check authentication status when the component mounts
    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = isAuthenticated();
            setCurrentUser(authenticated ? { authenticated: true } : null);
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login function
    const handleLogin = async (username, password) => {
        try {
            setError('');
            setLoading(true);
            await login(username, password);
            setCurrentUser({ authenticated: true });
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

    // Create the value object that will be provided to consumers
    const value = {
        currentUser,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: () => Boolean(currentUser)
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};