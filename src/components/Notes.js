import React, { useState, useEffect } from 'react';
import './Notes.css'; // Import the CSS file for styling
import Editor from './Editor'; // Import the Editor component

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        tags: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [noteIdToEdit, setNoteIdToEdit] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notes', {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });
                if (!response.ok) throw new Error('Failed to fetch notes');
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Error fetching notes:', error);
                alert('Failed to load notes. Please try again later.');
            }
        };
        fetchNotes();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote({
            ...newNote,
            [name]: value,
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const noteToSubmit = {
                ...newNote,
                tags: newNote.tags.split(',').map(tag => tag.trim()),
            };

            let response;
            if (editMode) {
                response = await fetch(`http://localhost:5000/api/notes/${noteIdToEdit}`, {
                    method: 'PUT', // Use PUT for updates
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteToSubmit),
                });
                if (!response.ok) throw new Error('Failed to update note');
                const updatedNote = await response.json();
                setNotes(notes.map(note => (note.id === noteIdToEdit ? updatedNote : note)));
            } else {
                response = await fetch('http://localhost:5000/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteToSubmit),
                });
                if (!response.ok) throw new Error('Failed to add new note');
                const newNoteFromResponse = await response.json();
                setNotes([...notes, newNoteFromResponse]);
            }

            // Reset form
            setNewNote({ title: '', content: '', tags: '' });
            setEditMode(false);
            setNoteIdToEdit(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to perform the operation. Please check your network connection and try again.');
        }
    };

    const handleEdit = (noteId) => {
        const noteToEdit = notes.find(note => note.id === noteId);
        setNewNote({
            title: noteToEdit.title,
            content: noteToEdit.content,
            tags: noteToEdit.tags.join(', '), // Join tags for editing
        });
        setEditMode(true);
        setNoteIdToEdit(noteId);
        setShowForm(true);
    };

    const handleDelete = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete note');
            setNotes(notes.filter(note => note.id !== noteId));
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete the note. Please try again.');
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="blog">
            <h1>Notes</h1>
            <div className="button-group">
                <button onClick={() => setShowSearch(!showSearch)}>
                    {showSearch ? 'Hide Search' : 'Show Search'}
                </button>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? (editMode ? 'Cancel Edit' : 'Hide Form') : (editMode ? 'Edit Notes' : 'Add New Notes')}
                </button>
                <button onClick={() => setShowNotes(!showNotes)}>
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                </button>
                <button onClick={() => setShowEditor(!showEditor)}>
                    {showEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
            </div>
            {showSearch && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            )}
            {showNotes && (
                <div className="blog-posts">
                    {filteredNotes.map(note => (
                        <div key={note.id} className="blog-post">
                            <h2>{note.title}</h2>
                            <p>{note.content}</p>
                            <p><strong>Tags:</strong> {note.tags ? note.tags.join(', ') : 'No Tags'}</p>
                            <p><strong>Date:</strong> {new Date(note.date_created).toLocaleDateString()}</p>
                            <button className="edit" onClick={() => handleEdit(note.id)}>Edit</button>
                            <button className="delete" onClick={() => handleDelete(note.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
            {showForm && (
                <div>
                    <h2>{editMode ? 'Edit Note' : 'Add a New Note'}</h2>
                    <form className="blog-form" onSubmit={handleSubmit}>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newNote.title}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newNote.content}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                        <label htmlFor="tags">Tags (comma-separated):</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={newNote.tags}
                            onChange={handleChange}
                        />
                        <button type="submit">{editMode ? 'Update Note' : 'Add Note'}</button>
                    </form>
                </div>
            )}
            {showEditor && <Editor />}
        </div>
    );
};

export default Notes;
