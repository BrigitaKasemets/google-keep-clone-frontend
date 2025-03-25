import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUser, deleteUser } from '../services/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Kontrolli, kas kasutaja on sisse logitud kohe pärast rakenduse laadimist
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Kasutaja sisselogimine
  const login = async (credentials) => {
    try {
      setError('');
      await loginUser(credentials);
      setCurrentUser(getCurrentUser());
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Sisselogimine ebaõnnestus';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Kasutaja registreerimine
  const register = async (userData) => {
    try {
      setError('');
      await registerUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registreerimine ebaõnnestus';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Kasutaja väljalogimine
  const logout = async () => {
    try {
      setError('');
      await logoutUser();
      setCurrentUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Väljalogimine ebaõnnestus';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Kasutaja profiili uuendamine
  const updateProfile = async (userId, userData) => {
    try {
      setError('');
      await updateUser(userId, userData);
      // Uuenda currentUser kui muudeti kasutajanime
      if (userData.username) {
        setCurrentUser(prev => ({ ...prev, username: userData.username }));
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profiili uuendamine ebaõnnestus';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Kasutaja konto kustutamine
  const deleteAccount = async (userId) => {
    try {
      setError('');
      await deleteUser(userId);
      setCurrentUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Konto kustutamine ebaõnnestus';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
