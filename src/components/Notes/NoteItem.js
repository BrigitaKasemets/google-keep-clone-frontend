import React, { useState, useEffect } from 'react';
import { getAllTags } from '../../services/tags';
import '../../App.css';

function NoteItem({ note, onDelete, onEdit }) {
  const [tags, setTags] = useState([]);
  
  // Lae sildid, et kuvada õiged siltide nimed
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
  
  // Kuupäeva vormindamine
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('et-EE');
  };
  
  // Leia sildi nimi ID järgi
  const getTagName = (tagId) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : '';
  };

  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button 
            className="btn btn-small btn-primary" 
            onClick={() => onEdit(note)}
            aria-label="Muuda"
          >
            Muuda
          </button>
          <button 
            className="btn btn-small btn-danger" 
            onClick={() => onDelete(note.id)}
            aria-label="Kustuta"
          >
            Kustuta
          </button>
        </div>
      </div>
      
      <div className="note-content">
        <p>{note.content}</p>
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tagId => (
            <span key={tagId} className="tag">
              {getTagName(tagId)}
            </span>
          ))}
        </div>
      )}
      
      {note.reminder && (
        <div className="note-reminder">
          <small>Meeldetuletus: {formatDate(note.reminder)}</small>
        </div>
      )}
    </div>
  );
}

export default NoteItem;
