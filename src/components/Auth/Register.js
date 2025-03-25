import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../App.css';

function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valideerimine
    if (!username) {
      setError('Kasutajanimi on kohustuslik');
      return;
    }
    
    if (username.length < 3) {
      setError('Kasutajanimi peab olema vähemalt 3 tähemärki pikk');
      return;
    }
    
    if (!password) {
      setError('Parool on kohustuslik');
      return;
    }
    
    if (password.length < 6) {
      setError('Parool peab olema vähemalt 6 tähemärki pikk');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Paroolid ei ühti');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Registreeri kasutaja
      const registerResult = await register({ username, password });
      
      if (registerResult.success) {
        // Automaatne sisselogimine pärast edukat registreerimist
        const loginResult = await login({ username, password });
        
        if (loginResult.success) {
          navigate('/');
        } else {
          navigate('/login');
        }
      } else {
        setError(registerResult.error);
      }
    } catch (err) {
      setError('Registreerimine ebaõnnestus. Palun proovi uuesti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Registreeri</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Kasutajanimi</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Parool</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Kinnita parool</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Laadimine...' : 'Registreeri'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Juba on konto olemas? <Link to="/login">Logi sisse</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
