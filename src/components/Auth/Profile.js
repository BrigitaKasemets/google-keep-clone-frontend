import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, updateUserDetails, deleteAccount, error: authError, setError: setAuthError } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [updateType, setUpdateType] = useState('');

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

    // Clear success message after 5 seconds
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [success]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Validate inputs
        const updates = {};
        let updatedFields = [];

        // Only include username in update if it has changed
        if (username !== currentUser.username && username.trim() !== '') {
            updates.username = username;
            updatedFields.push('kasutajanimi');
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
            updatedFields.push('parool');
        }

        // If nothing to update, show message
        if (Object.keys(updates).length === 0) {
            setError('Midagi ei ole muudetud');
            return;
        }

        // Store update type for success message
        setUpdateType(updatedFields.join(' ja '));

        // Update user details
        try {
            setIsLoading(true);
            const success = await updateUserDetails(updates);

            if (success) {
                setSuccess(`Kasutaja ${updateType} on edukalt uuendatud!`);
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

    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            setError('');
            const success = await deleteAccount();

            if (success) {
                navigate('/login');
            } else {
                setError('Konto kustutamine ebaõnnestus');
                setShowDeleteConfirmation(false);
            }
        } catch (err) {
            setError('Konto kustutamine ebaõnnestus: ' + (err.message || 'Tundmatu viga'));
            setShowDeleteConfirmation(false);
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

                {error && (
                    <div className="error-message">
                        <div className="message-content">{error}</div>
                        <button
                            className="close-message"
                            onClick={() => setError('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                {authError && (
                    <div className="error-message">
                        <div className="message-content">{authError}</div>
                        <button
                            className="close-message"
                            onClick={() => setAuthError('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        <div className="message-content">{success}</div>
                        <button
                            className="close-message"
                            onClick={() => setSuccess('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Kasutajanimi</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            className={username !== currentUser.username ? 'changed-field' : ''}
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
                            className={password ? 'changed-field' : ''}
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
                            className={confirmPassword ? 'changed-field' : ''}
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

                <div className="delete-account-section">
                    <h3>Konto kustutamine</h3>
                    <p>Konto kustutamine on jäädav toiming ja seda ei saa tagasi võtta.</p>

                    {showDeleteConfirmation ? (
                        <div className="delete-confirmation">
                            <p className="warning-text">Oled kindel, et soovid oma konto kustutada?</p>
                            <div className="confirmation-buttons">
                                <button
                                    className="cancel-delete"
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    disabled={isLoading}
                                >
                                    Tühista
                                </button>
                                <button
                                    className="confirm-delete"
                                    onClick={handleDeleteAccount}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Kustutamine...' : 'Jah, kustuta konto'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="delete-account-button"
                            onClick={() => setShowDeleteConfirmation(true)}
                            disabled={isLoading}
                        >
                            Kustuta konto
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;