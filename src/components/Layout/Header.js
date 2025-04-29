import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <Link to="/" className="app-logo">
                    Google Keep Clone
                </Link>
            </div>

            <div className="header-right">
                {currentUser ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="login-link">Login</Link>
                        <Link to="/register" className="register-link">Register</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;