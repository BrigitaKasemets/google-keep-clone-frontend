import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NoteList from './components/Notes/NoteList';
import TagsList from './components/Tags/TagsList';
import './App.css';

// Kaitstud marsruut, näitab komponenti ainult sisseloginud kasutajale
const PrivateRoute = ({ element }) => {
  const { currentUser, loading } = useAuth();
  
  // Kui autentimine alles laeb, näita laadimisanimatsiooni
  if (loading) {
    return <div className="loading">Laadimine...</div>;
  }
  
  // Kui kasutaja pole sisse loginud, suuna sisselogimislehele
  return currentUser ? element : <Navigate to="/login" />;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Kontrolli, kas kasutaja eelistab tumedat režiimi
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);
  
  // Rakenda tumeda režiimi klass body elemendile
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Tumeda režiimi lüliti
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Google Keep Kloon</h1>
            <button 
              className="theme-toggle" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Lülitu heledasse režiimi' : 'Lülitu tumedasse režiimi'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </header>
          
          <main className="app-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute element={<NoteList />} />} />
              <Route path="/tags" element={<PrivateRoute element={<TagsList />} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} Google Keep Kloon</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
