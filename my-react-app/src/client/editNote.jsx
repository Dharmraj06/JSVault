import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    language: "code",
    tags: "",
    code: "",
    codeDetails: "",
  });

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
    <div className="container">
      <h1>Edit Your Note</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="noteTitle">Title</label>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="form-control"
            id="noteTitle"
            placeholder="Enter note title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Languagetype">Language</label>
          <select
            value={note.language}
            onChange={(e) => setNote({ ...note, language: e.target.value })}
            className="form-control"
            id="Languagetype"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>
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
        </div>

        <div className="form-group">
          <label htmlFor="noteContent">Code</label>
          <textarea
            value={note.code}
            onChange={(e) => setNote({ ...note, code: e.target.value })}
            className="form-control"
            id="noteContent"
            rows="5"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="noteDetails">Code Details</label>
          <textarea
            value={note.codeDetails}
            onChange={(e) => setNote({ ...note, codeDetails: e.target.value })}
            className="form-control"
            id="noteDetails"
            rows="5"
          ></textarea>
        </div>

        <div>
          <Link to="/dashboard" className="button lite">
            Cancel
          </Link>
          <button type="submit" className="button">
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
}
