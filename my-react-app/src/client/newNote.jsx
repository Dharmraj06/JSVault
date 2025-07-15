import React from 'react';
import { Link } from 'react-router-dom';

export default function NewNote() {
    return (
        <>
            <div className="container">
                <h1>Create a New Note</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="noteTitle">Title</label>
                        <input type="text" className="form-control" id="noteTitle" placeholder="Enter note title" />
                        <p>Enter a title for your note.</p>
                    </div>

                    <div className="form-group">
                        <div>
                            <label htmlFor="noteType">Language</label>
                            <select className="form-control" id="Languagetype">
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
                            <input type="text" className="form-control" id="Tag" placeholder="Enter tags (comma separated)" />
                            <p>Use tags to categorize your notes.</p>
                        </div>

                    </div>

                    <div className="form-group">
                        <div>
                        <label htmlFor="noteContent">Code</label>
                        <textarea className="form-control" id="noteContent" rows="5" placeholder="Write your code here..."></textarea>
                        <p>Write your code snippet here.</p>
                        </div>

                        <div> 
                        <label htmlFor="noteContent">Code Details</label>
                        <textarea className="form-control" id="noteContent" rows="5" placeholder="Write your note here..."></textarea>
                        <p>Write your note here.</p>
                        </div>
                    </div>

                    <div>
                        <Link to="/dashboard" className="btn btn-secondary ml-2">Cancel</Link>
                        <button type="submit" className="btn btn-primary">Save Note</button>
                    </div>
                    
                </form>
            </div>
<<<<<<< HEAD
=======
            
>>>>>>> 000a100f5e390cd68fe213bb8fbe7bb306753ad8
        </>
    );
}