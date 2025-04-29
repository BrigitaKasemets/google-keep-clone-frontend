import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import NotesList from './components/Notes/NotesList';
import './App.css';

// Protected route component
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Main dashboard component that shows sidebar and notes
const Dashboard = () => {
    const [selectedTag, setSelectedTag] = useState(null);

    return (
        <div className="dashboard-container">
            <Sidebar onTagSelect={setSelectedTag} selectedTag={selectedTag} />
            <div className="main-content">
                <NotesList selectedTag={selectedTag} />
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Header />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <NotesProvider>
                                        <Dashboard />
                                    </NotesProvider>
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;