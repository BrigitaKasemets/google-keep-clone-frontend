import React, { useState, useEffect } from 'react';
import { createNote, updateNote } from '../../services/notes';
import { getAllTags } from '../../services/tags';
import '../../App.css';

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [reminder, setReminder] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kui märge on olemas, täida vorm
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setSelectedTags(note.tags || []);
      setReminder(note.reminder || '');
    } else {
      // Tühjenda vorm kui lisatakse uut märget
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setReminder('');
    }
  }, [note]);

  // Lae sildid
  useEffect(() => {
    async function fetchTags() {
      try {
        const tagsData = await getAllTags();
        setTags(tagsData);
      } catch (err) {
        console.error('Siltide laadimine ebaõnnestus:', err);
      }
    }
    
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valideerimine
    if (!title.trim()) {
      setError('Pealkiri on kohustuslik');
      return;
    }
    
    if (!content.trim()) {
      setError('Sisu on kohustuslik');
      return;
    }
    
    // Kontrolli, et meeldetuletus ei oleks minevikus
    if (reminder) {
      const reminderDate = new Date(reminder);
      const now = new Date();
      
      if (reminderDate < now) {
        setError('Meeldetuletus ei saa olla minevikus');
        return;
      }
    }
    
    const noteData = {
      title,
      content,
      tags: selectedTags,
      reminder
    };
    
    try {
      setError('');
      setLoading(true);
      
      let savedNote;
      
      if (note) {
        // Uuenda olemasolevat märget
        await updateNote(note.id, noteData);
        savedNote = { ...note, ...noteData };
      } else {
        // Loo uus märge
        const response = await createNote(noteData);
        savedNote = response.note;
      }
      
      onSave(savedNote, !note);
      
      // Tühjenda vorm kui lisati uus märge (mitte kui uuendati)
      if (!note) {
        setTitle('');
        setContent('');
        setSelectedTags([]);
        setReminder('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Märkme salvestamine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId) => {
    if (selectedTags.includes(tagId)) {
      // Eemalda silt
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      // Lisa silt
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Pealkiri</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Märkme pealkiri"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Sisu</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder="Märkme sisu..."
          rows="4"
          required
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="tags">Sildid</label>
        <div className="tags-container">
          {tags.length === 0 ? (
            <p className="info-text">Silte pole veel lisatud</p>
          ) : (
            tags.map(tag => (
              <label key={tag.id} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  disabled={loading}
                />
                <span>{tag.name}</span>
              </label>
            ))
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="reminder">Meeldetuletus</label>
        <input
          type="datetime-local"
          id="reminder"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="form-buttons">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Salvestamine...' : note ? 'Salvesta muudatused' : 'Lisa märge'}
        </button>
        
        {note && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Tühista
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;
