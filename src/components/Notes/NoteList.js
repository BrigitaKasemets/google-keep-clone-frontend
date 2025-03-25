import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNotes, deleteNote } from '../../services/notes';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';
import { useAuth } from '../../contexts/AuthContext';
import '../../App.css';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Lae märkmed
  useEffect(() => {
    async function fetchNotes() {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const notesData = await getAllNotes();
        setNotes(notesData);
        setError('');
      } catch (err) {
        setError('Märkmete laadimine ebaõnnestus');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotes();
  }, [currentUser, navigate]);

  // Märkme kustutamine
  const handleDelete = async (noteId) => {
    if (window.confirm('Oled kindel, et soovid selle märkme kustutada?')) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (err) {
        setError('Märkme kustutamine ebaõnnestus');
        console.error(err);
      }
    }
  };

  // Märkme muutmine
  const handleEdit = (note) => {
    setEditingNote(note);
  };

  // Uuenda märkmete loendit pärast lisamist või muutmist
  const updateNotesList = (updatedNote, isNew = false) => {
    if (isNew) {
      setNotes([...notes, updatedNote]);
    } else {
      setNotes(notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    }
    setEditingNote(null);
  };

  // Tühista muutmine
  const cancelEdit = () => {
    setEditingNote(null);
  };

  if (loading) {
    return <div className="loading">Laadimine...</div>;
  }

  return (
    <div className="notes-container">
      <h2>Märkmed</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="note-form-container">
        <h3>{editingNote ? 'Muuda märget' : 'Lisa uus märge'}</h3>
        <NoteForm 
          note={editingNote} 
          onSave={updateNotesList}
          onCancel={cancelEdit}
        />
      </div>
      
      <div className="notes-grid">
        {notes.length === 0 ? (
          <p className="empty-message">Märkmeid pole veel lisatud.</p>
        ) : (
          notes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NoteList;
