import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill for the rich-text editor
import 'react-quill/dist/quill.snow.css'; // Import the Quill CSS for styling
import './Editor.css'; // Import custom CSS for styling
import axios from 'axios'; // Import Axios for API calls

const Editor = ({ noteId }) => { // Assume noteId is passed as a prop
    const [content, setContent] = useState('');

    // Handle content change in the editor
    const handleContentChange = (value) => {
        setContent(value);
    };

    // Save content to the backend
    const handleSave = async () => {
        try {
            await axios.post('/api/editor_content', { 
                note_id: noteId, // Use the passed noteId
                content 
            });
            alert('Content saved successfully!');
        } catch (error) {
            alert('Error saving content: ' + error.response?.data?.error || error.message);
        }
    };

    // Load saved content from the backend
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`/api/editor_content/note/${noteId}`);
                setContent(response.data.content); // Assume response contains the content
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        if (noteId) {
            fetchContent();
        }
    }, [noteId]);

    return (
        <div className="editor-container">
            <h2>Editor</h2>
            <ReactQuill 
                value={content} 
                onChange={handleContentChange} 
                modules={Editor.modules} 
                formats={Editor.formats} 
            />
            <button className="save-button" onClick={handleSave}>Save</button>
        </div>
    );
};

// Define modules and formats for ReactQuill editor
Editor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ 'align': [] }],
        ['clean']
    ],
};

Editor.formats = [
    'header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'image', 'align'
];

export default Editor;
