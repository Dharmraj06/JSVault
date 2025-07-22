import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function NewNote() {
    const [noteTitle, setNoteTitle] = React.useState('');
    const [languageType, setLanguageType] = React.useState('code');
    const [tags, setTags] = React.useState('');
    const [code, setCode] = React.useState('');
    const [codeDetails, setCodeDetails] = React.useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const noteData = {
            title: noteTitle,
            language: languageType,
            tags: tags,
            code: code,
            codeDetails: codeDetails,
        };
        
        console.log(noteData);
        axios.post('http://localhost:5174/newNote', noteData,{withCredentials: true})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("error in creating new note: ",error);
            });
    };

    return (
        <>
            <div className="container">
                <h1>Create a New Note</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="noteTitle">Title</label>
                        <input type="text" onChange={(e) => setNoteTitle(e.target.value)} className="form-control" id="noteTitle" placeholder="Enter note title" />
                        <p>Enter a title for your note.</p>
                    </div>

                    <div className="form-group">
                        <div>
                            <label htmlFor="Languagetype">Language</label>
                            <select onSelect={(e) => setLanguageType(e.target.value)} className="form-control" id="Languagetype">
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
                            <input onChange={(e) => setTags(e.target.value)} type="text" className="form-control" id="Tag" placeholder="Enter tags (comma separated)" />
                            <p>Use tags to categorize your notes.</p>
                        </div>

                    </div>

                    <div className="form-group">
                        <div>
                        <label htmlFor="noteContent">Code</label>
                        <textarea onChange={(e) => setCode(e.target.value)} className="form-control" id="noteContent" rows="5" placeholder="Write your code here..."></textarea>
                        <p>Write your code snippet here.</p>
                        </div>

                        <div> 
                        <label htmlFor="noteDetails">Code Details</label>
                        <textarea onChange={(e) => setCodeDetails(e.target.value)} className="form-control" id="noteDetails" rows="5" placeholder="Write your note here..."></textarea>
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