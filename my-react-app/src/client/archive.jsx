import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5174/archivedNotes", {
          withCredentials: true,
        });
        setArchivedNotes(response.data);
      } catch (error) {
        console.error("Error fetching archived notes:", error);
      }
    };

    fetchArchivedNotes();
  }, []);

  const handleArchive = async(noteId) => {
    try{
      const res = await axios.post(`http://localhost:5174/unarchiveNote/${noteId}`, {}, {
        withCredentials: true,
      });
      if(res.status ===200){
        console.log(`Note unarchived: ${noteId}`);
        setArchivedNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      } else {
        console.log("Failed to unarchive the note.");
      }
    } catch (error) {
      console.error("error aa gayi hai: ", error);
    }
  }

  return (
    <div className="container">
      <h2>Archived Notes</h2>
      {archivedNotes.length === 0 ? (
        <p>No archived notes available.</p>
      ) : (
        <div className="notes-grid">
          {archivedNotes.map((note) => (
            <div className="card" key={note._id}>
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">
                  {note.codeDetails.length > 200
                    ? `${note.codeDetails.slice(0, 200)}...`
                    : note.codeDetails}
                </p>
                <div style={{ marginTop: "10px" }}>
                  <Link to={`/editNotes/${note._id}`} className="button-link">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleArchive(note._id)} 
                    className="button-link lite ml-2">
                    Unarchive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
