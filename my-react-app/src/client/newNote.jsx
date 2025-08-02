import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewNote() {
  const [noteTitle, setNoteTitle] = React.useState("");
  const [languageType, setLanguageType] = React.useState("python");
  const [tags, setTags] = React.useState("");
  const [code, setCode] = React.useState("");
  const [codeDetails, setCodeDetails] = React.useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const noteData = {
      title: noteTitle,
      language: languageType,
      tags,
      code,
      codeDetails,
    };

    axios
      .post("http://localhost:5174/newNote", noteData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error in creating new note:", error);
      });
  };

  return (
    <div>
      <div className="newNote-container">
      <h1 id="newnote-h1">Create a New Note</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="form-group newnote-title">
          <label htmlFor="noteTitle">Title</label>
          <input
            type="text"
            id="noteTitle"
            className="form-control"
            placeholder="Enter note title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <p>Enter a title for your note.</p>
        </div>

        {/* Language and Tags */}
        <div className="newnote-type">
          <div className="form-group">
            <label htmlFor="languageType">Language</label>
            <select
              id="languageType"
              className="form-control"
              value={languageType}
              onChange={(e) => setLanguageType(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
            </select>
            <p>Select the programming language for your code snippet.</p>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              className="form-control"
              placeholder="Enter tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p>Use tags to categorize your notes.</p>
          </div>
        </div>

        {/* Code and Code Details Side by Side */}
        <div className="code-row">
          <div className="form-group">
            <label htmlFor="code">Code</label>
            <textarea
              id="code"
              className="form-control"
              rows="10"
              placeholder="Write your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></textarea>
            <p>Write your code snippet here.</p>
          </div>

          <div className="form-group">
            <label htmlFor="codeDetails">Code Details</label>
            <textarea
              id="codeDetails"
              className="form-control"
              rows="10"
              placeholder="Write your note here..."
              value={codeDetails}
              onChange={(e) => setCodeDetails(e.target.value)}
            ></textarea>
            <p>Write additional information about your code here.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-group mt-3">
          <Link to="/dashboard" className="button-link lite">
            Cancel
          </Link>
          <button type="submit" className="button ml-2">
            Save Note
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
