import React, { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';

const NoteForm = ({ note, onComplete, availableTags }) => {
    const { addNote, editNote } = useNotes();
    const [title, setTitle] = useState(note ? note.title : '');
    const [content, setContent] = useState(note ? note.content : '');
    const [selectedTags, setSelectedTags] = useState(note && note.tags ? note.tags : []);
    const [reminder, setReminder] = useState(note && note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(note);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        const noteData = {
            title,
            content,
            tags: selectedTags,
            reminder: reminder ? new Date(reminder).toISOString() : null
        };

        setIsSubmitting(true);
        setError('');

        try {
            if (isEditMode) {
                await editNote(note.id, noteData);
            } else {
                await addNote(noteData);
            }
            onComplete();
        } catch (err) {
            setError(`Failed to ${isEditMode ? 'update' : 'create'} note: ${err.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tagId)) {
                return prevSelectedTags.filter(id => id !== tagId);
            } else {
                return [...prevSelectedTags, tagId];
            }
        });
    };

    return (
        <div className="note-form-container">
            <h3>{isEditMode ? 'Edit Note' : 'Create New Note'}</h3>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="note-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        required
                        rows={6}
                    />
                </div>

                <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-selector">
                        {availableTags.length === 0 ? (
                            <p className="no-tags">No tags available. Create tags in the sidebar.</p>
                        ) : (
                            availableTags.map(tag => (
                                <div key={tag.id} className="tag-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`tag-${tag.id}`}
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={() => handleTagToggle(tag.id)}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="reminder">Reminder (optional)</label>
                    <input
                        type="datetime-local"
                        id="reminder"
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onComplete}
                        className="cancel-button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? (isEditMode ? 'Saving...' : 'Creating...')
                            : (isEditMode ? 'Save Changes' : 'Create Note')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoteForm;