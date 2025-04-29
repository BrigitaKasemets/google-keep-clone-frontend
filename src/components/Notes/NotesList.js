import React, { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';

const NotesList = ({ selectedTag }) => {
    const { notes, tags, loading } = useNotes();
    const [isAddingNote, setIsAddingNote] = useState(false);

    // Filter notes based on selected tag
    const filteredNotes = selectedTag
        ? notes.filter(note => note.tags && note.tags.includes(selectedTag))
        : notes;

    return (
        <div className="notes-container">
            <div className="notes-header">
                <h2>My Notes</h2>
                <button
                    className="add-note-button"
                    onClick={() => setIsAddingNote(!isAddingNote)}
                >
                    {isAddingNote ? 'Cancel' : 'Add Note'}
                </button>
            </div>

            {isAddingNote && (
                <NoteForm
                    onComplete={() => setIsAddingNote(false)}
                    availableTags={tags}
                />
            )}

            {loading ? (
                <div className="loading-notes">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
                <div className="no-notes">
                    {selectedTag
                        ? 'No notes with this tag'
                        : 'No notes yet. Create your first note!'}
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredNotes.map(note => (
                        <NoteItem
                            key={note.id}
                            note={note}
                            availableTags={tags}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesList;