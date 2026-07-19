import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LANGUAGES } from "./languages";
import CodeEditor from "./CodeEditor";

export default function NewNote() {
  const [noteTitle, setNoteTitle] = React.useState("");
  const [languageType, setLanguageType] = React.useState("JavaScript");
  const [tags, setTags] = React.useState("");
  const [code, setCode] = React.useState("");
  const [codeDetails, setCodeDetails] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [summaryError, setSummaryError] = React.useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);

  const navigate = useNavigate();

  const handleGenerateSummary = async () => {
    setSummaryError("");
    setIsGeneratingSummary(true);

    try {
      const response = await axios.post(
        "http://localhost:5174/api/notes/generate-summary",
        {
          title: noteTitle,
          language: languageType,
          code,
          description: codeDetails,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to generate summary. Please try again or write one manually.";
      setSummaryError(message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const noteData = {
      title: noteTitle,
      language: languageType,
      tags: tags.split(",").map((t) => t.trim()),
      code,
      codeDetails,
      summary,
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
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
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
            <CodeEditor
              value={code}
              onChange={setCode}
              language={languageType}
            />
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

        <div className="form-group newnote-title">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            className="form-control"
            rows="4"
            placeholder="Generate a summary or write your own..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
          <p>Briefly describe what the code does and where it is useful.</p>
          <button
            type="button"
            className="button lite"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary ? "Generating..." : "Generate Summary"}
          </button>
          {summaryError && <p className="summary-error">{summaryError}</p>}
        </div>

        {/* Buttons */}
        <div className="form-actions">
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
