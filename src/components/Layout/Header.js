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
                    <div className="user-menu">
            <span className="username">
              Tere, {currentUser.username}!
            </span>
                        <Link to="/profile" className="profile-link">
                            Minu profiil
                        </Link>
                        <button onClick={handleLogout} className="logout-button">
                            Logi välja
                        </button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="login-link">
                            Logi sisse
                        </Link>
                        <Link to="/register" className="register-link">
                            Registreeri
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;