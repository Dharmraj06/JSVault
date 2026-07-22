import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getNoteSummary } from "./noteHelpers";
import NotePopup from "./NotePopup";

export default function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedNote(null);
  };

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

  const handleArchive = async (e, noteId) => {
    e.stopPropagation();
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
    <>
    <div className="newNote-container">
      <h2>Archived Notes</h2>
      {archivedNotes.length === 0 ? (
        <p>No archived notes available.</p>
      ) : (
        <div className="notes-grid">
          {archivedNotes.map((note) => (
            <div className="card" key={note._id}>
              <div
                className="card-clickable-area"
                onClick={() => handleNoteClick(note)}
              >
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-language">{note.language}</p>
                  <hr />
                  <p className="card-text">{getNoteSummary(note)}</p>
                </div>
              </div>
              <div className="card-actions">
                  <Link
                    to={`/editNotes/${note._id}`}
                    className="button-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => handleArchive(e, note._id)}
                    className="button-link lite"
                  >
                    Unarchive
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      {isPopupOpen && selectedNote && (
        <NotePopup selectedNote={selectedNote} onClose={handleClosePopup} />
      )}
    </>
  );
}
