import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, updateUserDetails, error: authError } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update username when currentUser changes
    useEffect(() => {
        if (currentUser && currentUser.username) {
            setUsername(currentUser.username);
        }
    }, [currentUser]);

    // If no user is logged in, redirect to login
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Validate inputs
        const updates = {};

        // Only include username in update if it has changed
        if (username !== currentUser.username && username.trim() !== '') {
            updates.username = username;
        }

        // Only include password if it's provided and matches confirmation
        if (password) {
            if (password.length < 6) {
                setError('Parool peab olema vähemalt 6 tähemärki pikk');
                return;
            }

            if (password !== confirmPassword) {
                setError('Paroolid ei ühti');
                return;
            }

            updates.password = password;
        }

        // If nothing to update, show message
        if (Object.keys(updates).length === 0) {
            setError('Midagi ei ole muudetud');
            return;
        }

        // Update user details
        try {
            setIsLoading(true);
            const success = await updateUserDetails(updates);

            if (success) {
                setSuccess('Kasutaja andmed on edukalt uuendatud');
                // Clear password fields after successful update
                setPassword('');
                setConfirmPassword('');
            } else {
                setError('Andmete uuendamine ebaõnnestus');
            }
        } catch (err) {
            setError('Andmete uuendamine ebaõnnestus: ' + (err.message || 'Tundmatu viga'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return null; // Don't render anything if not logged in
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Minu profiil</h2>

                {error && <div className="error-message">{error}</div>}
                {authError && <div className="error-message">{authError}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Kasutajanimi</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Uus parool (jäta tühjaks, kui ei soovi muuta)</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="Uus parool"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Kinnita uus parool</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading || !password}
                            placeholder="Kinnita uus parool"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/')}
                            disabled={isLoading}
                        >
                            Tühista
                        </button>

                        <button
                            type="submit"
                            className="update-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Uuendamine...' : 'Uuenda andmeid'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;