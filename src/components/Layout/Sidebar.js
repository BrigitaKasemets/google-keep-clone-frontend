import React, { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';

const Sidebar = ({ onTagSelect, selectedTag }) => {
    const { tags, addTag, removeTag, loading } = useNotes();
    const [newTagName, setNewTagName] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;

        try {
            await addTag(newTagName);
            setNewTagName('');
            setIsAddingTag(false);
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await removeTag(tagId);
                if (selectedTag === tagId) {
                    onTagSelect(null);
                }
            } catch (error) {
                console.error('Failed to delete tag:', error);
            }
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Tags</h3>
                <button
                    className="add-tag-button"
                    onClick={() => setIsAddingTag(!isAddingTag)}
                >
                    {isAddingTag ? 'Cancel' : 'Add Tag'}
                </button>
            </div>

            {isAddingTag && (
                <form onSubmit={handleCreateTag} className="new-tag-form">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        required
                    />
                    <button type="submit">Create</button>
                </form>
            )}

            <div className="tags-list">
                <div
                    className={`tag-item ${selectedTag === null ? 'selected' : ''}`}
                    onClick={() => onTagSelect(null)}
                >
                    All Notes
                </div>

                {loading ? (
                    <div className="loading-tags">Loading tags...</div>
                ) : (
                    tags.map(tag => (
                        <div
                            key={tag.id}
                            className={`tag-item ${selectedTag === tag.id ? 'selected' : ''}`}
                        >
              <span
                  className="tag-name"
                  onClick={() => onTagSelect(tag.id)}
              >
                {tag.name}
              </span>
                            <button
                                className="delete-tag"
                                onClick={() => handleDeleteTag(tag.id)}
                            >
                                &times;
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;