import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTags, createTag, updateTag, deleteTag } from '../../services/tags';
import { useAuth } from '../../contexts/AuthContext';
import '../../App.css';

function TagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Lae sildid
  useEffect(() => {
    async function fetchTags() {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const tagsData = await getAllTags();
        setTags(tagsData);
        setError('');
      } catch (err) {
        setError('Siltide laadimine ebaõnnestus');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTags();
  }, [currentUser, navigate]);

  // Sildi lisamine
  const handleAddTag = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Sildi nimi on kohustuslik');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingTagId) {
        // Sildi uuendamine
        await updateTag(editingTagId, { name });
        setTags(tags.map(tag => 
          tag.id === editingTagId ? { ...tag, name } : tag
        ));
      } else {
        // Uue sildi lisamine
        const response = await createTag({ name });
        setTags([...tags, response.tag]);
      }
      
      setName('');
      setEditingTagId(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Sildi salvestamine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  // Sildi kustutamine
  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Oled kindel, et soovid selle sildi kustutada?')) {
      try {
        await deleteTag(tagId);
        setTags(tags.filter(tag => tag.id !== tagId));
      } catch (err) {
        setError('Sildi kustutamine ebaõnnestus');
        console.error(err);
      }
    }
  };

  // Sildi muutmine
  const handleEditTag = (tag) => {
    setName(tag.name);
    setEditingTagId(tag.id);
  };

  // Tühista muutmine
  const handleCancelEdit = () => {
    setName('');
    setEditingTagId(null);
  };

  if (loading && tags.length === 0) {
    return <div className="loading">Laadimine...</div>;
  }

  return (
    <div className="tags-container">
      <h2>Sildid</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="note-form-container">
        <h3>{editingTagId ? 'Muuda silti' : 'Lisa uus silt'}</h3>
        <form onSubmit={handleAddTag} className="note-form">
          <div className="form-group">
            <label htmlFor="tagName">Sildi nimi</label>
            <input
              type="text"
              id="tagName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Sisesta sildi nimi"
              required
            />
          </div>
          
          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Salvestamine...' : editingTagId ? 'Salvesta muudatused' : 'Lisa silt'}
            </button>
            
            {editingTagId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Tühista
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="tags-list">
        {tags.length === 0 ? (
          <p className="empty-message">Silte pole veel lisatud.</p>
        ) : (
          tags.map(tag => (
            <div key={tag.id} className="tag-item">
              <div className="tag-info">
                <span className="tag-name">{tag.name}</span>
              </div>
              
              <div className="tag-actions">
                <button 
                  className="btn btn-small btn-primary" 
                  onClick={() => handleEditTag(tag)}
                >
                  Muuda
                </button>
                <button 
                  className="btn btn-small btn-danger" 
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  Kustuta
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TagsList;
