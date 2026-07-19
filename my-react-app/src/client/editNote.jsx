import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LANGUAGES } from "./languages";
import CodeEditor from "./CodeEditor";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    language: "code",
    tags: "",
    code: "",
    codeDetails: "",
    summary: "",
  });
  const [summaryError, setSummaryError] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5174/editNotes/${id}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setNote({
            ...res.data,
            tags: res.data.tags.join(", "),
          });
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };

    fetchNote();
  }, [id]);

  const handleGenerateSummary = async () => {
    setSummaryError("");
    setIsGeneratingSummary(true);

    try {
      const response = await axios.post(
        "http://localhost:5174/api/notes/generate-summary",
        {
          title: note.title,
          language: note.language,
          code: note.code,
          description: note.codeDetails,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setNote({ ...note, summary: response.data.summary });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5174/editNote/${id}`,
        {
          ...note,
          tags: note.tags.split(",").map((t) => t.trim()), // convert back to array
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log("Note updated successfully");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  return (
    <div>
      <div className="newNote-container">
        <h1 id="newnote-h1">Edit Your Note</h1>
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="form-group newnote-title">
            <label htmlFor="noteTitle">Title</label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="form-control"
              id="noteTitle"
              placeholder="Enter note title"
            />
            <p>Enter a title for your note.</p>
          </div>

          {/* Language and Tags */}
          <div className="newnote-type">
            <div className="form-group">
              <label htmlFor="Languagetype">Language</label>
              <select
                value={note.language}
                onChange={(e) => setNote({ ...note, language: e.target.value })}
                className="form-control"
                id="Languagetype"
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
              <label htmlFor="Tag">Tags</label>
              <input
                type="text"
                value={note.tags}
                onChange={(e) => setNote({ ...note, tags: e.target.value })}
                className="form-control"
                id="Tag"
                placeholder="Enter tags (comma separated)"
              />
              <p>Use tags to categorize your notes.</p>
            </div>
          </div>

          {/* Code and Code Details Side by Side */}
          <div className="code-row">
            <div className="form-group">
              <label htmlFor="noteContent">Code</label>
              <CodeEditor
                value={note.code}
                onChange={(value) => setNote({ ...note, code: value })}
                language={note.language}
              />
              <p>Write your code snippet here.</p>
            </div>

            <div className="form-group">
              <label htmlFor="noteDetails">Code Details</label>
              <textarea
                value={note.codeDetails}
                onChange={(e) => setNote({ ...note, codeDetails: e.target.value })}
                className="form-control"
                id="noteDetails"
                rows="10"
                placeholder="Write your note here..."
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
              value={note.summary || ""}
              onChange={(e) => setNote({ ...note, summary: e.target.value })}
            ></textarea>
            <p>Briefly describe what the code does and where it is useful.</p>
            <button
              type="button"
              className="button lite"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? "Generating..." : "Regenerate Summary"}
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
