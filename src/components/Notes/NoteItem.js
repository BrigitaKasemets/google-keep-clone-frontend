import React, { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import NoteForm from './NoteForm';

const NoteItem = ({ note, availableTags }) => {
    const { removeNote } = useNotes();
    const [isEditing, setIsEditing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await removeNote(note.id);
            } catch (error) {
                console.error('Failed to delete note:', error);
            }
        }
    };

    // Find tag names for this note's tags
    const noteTagNames = note.tags
        ? note.tags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? tag.name : 'Unknown';
        })
        : [];

    // Format reminder date if present
    const formattedReminder = note.reminder
        ? new Date(note.reminder).toLocaleString()
        : null;

    if (isEditing) {
        return (
            <NoteForm
                note={note}
                onComplete={() => setIsEditing(false)}
                availableTags={availableTags}
            />
        );
    }

    return (
        <div className="note-card">
            <div
                className="note-content"
                onClick={() => setShowDetails(!showDetails)}
            >
                <h3 className="note-title">{note.title}</h3>

                {showDetails ? (
                    <>
                        <div className="note-body">{note.content}</div>

                        {noteTagNames.length > 0 && (
                            <div className="note-tags">
                                <span className="tags-label">Tags:</span>
                                {noteTagNames.map((tagName, index) => (
                                    <span key={index} className="tag-pill">
                    {tagName}
                  </span>
                                ))}
                            </div>
                        )}

                        {formattedReminder && (
                            <div className="note-reminder">
                                <span className="reminder-label">Reminder:</span>
                                <span className="reminder-time">{formattedReminder}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="note-preview">
                        {note.content.length > 100
                            ? `${note.content.substring(0, 100)}...`
                            : note.content}
                    </div>
                )}
            </div>

            <div className="note-actions">
                <button
                    className="edit-note"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    Edit
                </button>
                <button
                    className="delete-note"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NoteItem;