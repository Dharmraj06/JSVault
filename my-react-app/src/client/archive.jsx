import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(() => {
    const fetchArchivedNotes = async (req, res) => {
      try {
        // id = req.user._id;
        const response = await axios.get(`http://localhost:5174/archivedNotes`, {
          withCredentials: true,
        });
        setArchivedNotes(response.data);
      } catch (error) {
        console.error("Error fetching archived notes:", error);
      }
    };

    fetchArchivedNotes();
  }, []);

  return (
    <div className="container">
      <h2>Archived Notes</h2>
      {archivedNotes.length === 0 ? (
        <p>No archived notes available.</p>
      ) : (
        archivedNotes.map((note) => (
          <div key={note._id} className="card">
            <h3>{note.title}</h3>
            <p><strong>Language:</strong> {note.language}</p>
            <p><strong>Tags:</strong> {note.tags.join(", ")}</p>
            <pre>{note.code}</pre>
            <p>{note.codeDetails}</p>
          </div>
        ))
      )}
    </div>
  );
}
