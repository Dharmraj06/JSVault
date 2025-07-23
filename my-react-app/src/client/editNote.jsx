import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
export default function EditNote() {
    const { id } = useParams();
    const [title, setTitle] = React.useState('');
    const [languageType, setLanguageType] = React.useState('code');
    const [tags, setTags] = React.useState('');
    const [code, setCode] = React.useState('');
    const [codeDetails, setCodeDetails] = React.useState('');
    const [note, setNote] = React.useState({
        title: '',
        language: '',
        tags: '',
        code: '',
        codeDetails: '',
    });


    useEffect(() => {
        
        const fetchNotes = async () => {
            try {
            const response = await axios.get(`http://localhost:5174/editNote/${id}`, {
                withCredentials: true,
            });
                if (response.status === 200) {
                    setTitle(response.data.title);
                    setLanguageType(response.data.language);
                    setTags(response.data.tags.join(', '));
                    setCode(response.data.code);
                    setCodeDetails(response.data.codeDetails);
                    setNote(response.data);
                } else {
                    console.error('Failed to fetch note:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };
        fetchNotes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5174/newNote', note, {
                withCredentials: true,
            });
            if (response.status === 201) {
                console.log('Note created successfully:', response.data);
            } else {
                console.error('Failed to create note:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };
    return (
        <>
            <div className="container">
                <h1>Edit Your Note</h1>
                <form >
                    <div className="form-group">
                        <label htmlFor="noteTitle">Title</label>
                        <input type="text" value={title} onChange={(e) => setNote({ ...note, title: e.target.value })} className="form-control" id="noteTitle" placeholder="Enter note title" />
                        <p>Enter a title for your note.</p>
                    </div>

                    <div className="form-group">
                        <div>
                            <label htmlFor="Languagetype">Language</label>
                            <select value={languageType} onChange={(e) => setNote({ ...note, language: e.target.value })} className="form-control" id="Languagetype">
                                <option value="code">Python</option>
                                <option value="note">JavaScript</option>
                                <option value="note">Java</option>
                                <option value="note">C++</option>
                                <option value="note">C#</option>
                            </select>
                            <p>Select the programming language for your code snippet.</p>
                        </div>
                    
                        <div>
                            <label htmlFor="Tag">Tags</label>
                            <input value={tags} onChange={(e) => setNote({ ...note, tags: e.target.value })} type="text" className="form-control" id="Tag" placeholder="Enter tags (comma separated)" />
                            <p>Use tags to categorize your notes.</p>
                        </div>

                    </div>

                    <div className="form-group">
                        <div>
                        <label htmlFor="noteContent">Code</label>
                        <textarea value={code} onChange={(e) => setNote({...note, code: e.target.value})} className="form-control" id="noteContent" rows="5" placeholder="Write your code here..."></textarea>
                        <p>Write your code snippet here.</p>
                        </div>

                        <div> 
                        <label htmlFor="noteDetails">Code Details</label>
                        <textarea value={codeDetails} onChange={(e) => setNote({...note, codeDetails: e.target.value})} className="form-control" id="noteDetails" rows="5" placeholder="Write your note here..."></textarea>
                        <p>Write your note here.</p>
                        </div>
                    </div>

                    <div>
                        <Link to="/dashboard" className="button lite">Cancel</Link>
                        <button type="submit" className="button">Save Note</button>
                    </div>
                    
                </form>
            </div>
        </>
    );
}