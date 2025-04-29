import React, { createContext, useState, useEffect, useContext } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notes';
import { getTags, createTag, deleteTag } from '../services/tags';
import { useAuth } from './AuthContext';

// Create the context
const NotesContext = createContext();

// Custom hook to use the notes context
export const useNotes = () => {
    return useContext(NotesContext);
};

// Provider component
export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();

    // Load notes and tags when the component mounts and when auth state changes
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated()) {
                setNotes([]);
                setTags([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Fetch notes and tags in parallel
                const [notesData, tagsData] = await Promise.all([
                    getNotes(),
                    getTags()
                ]);

                setNotes(notesData);
                setTags(tagsData);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Add a new note
    const addNote = async (noteData) => {
        try {
            setError('');
            const result = await createNote(noteData);
            setNotes(prevNotes => [...prevNotes, result.note]);
            return result.note;
        } catch (err) {
            setError('Failed to create note');
            console.error(err);
            throw err;
        }
    };

    // Update an existing note
    const editNote = async (id, noteData) => {
        try {
            setError('');
            await updateNote(id, noteData);
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === id ? { ...note, ...noteData } : note
                )
            );
            return true;
        } catch (err) {
            setError('Failed to update note');
            console.error(err);
            throw err;
        }
    };

    // Remove a note
    const removeNote = async (id) => {
        try {
            setError('');
            await deleteNote(id);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            return true;
        } catch (err) {
            setError('Failed to delete note');
            console.error(err);
            throw err;
        }
    };

    // Add a new tag
    const addTag = async (name) => {
        try {
            setError('');
            const result = await createTag(name);
            setTags(prevTags => [...prevTags, result.tag]);
            return result.tag;
        } catch (err) {
            setError('Failed to create tag');
            console.error(err);
            throw err;
        }
    };

    // Remove a tag
    const removeTag = async (id) => {
        try {
            setError('');
            await deleteTag(id);
            setTags(prevTags => prevTags.filter(tag => tag.id !== id));
            // Also remove this tag from any notes that have it
            setNotes(prevNotes =>
                prevNotes.map(note => ({
                    ...note,
                    tags: note.tags ? note.tags.filter(tagId => tagId !== id) : []
                }))
            );
            return true;
        } catch (err) {
            setError('Failed to delete tag');
            console.error(err);
            throw err;
        }
    };

    // Create the value object
    const value = {
        notes,
        tags,
        loading,
        error,
        addNote,
        editNote,
        removeNote,
        addTag,
        removeTag
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};