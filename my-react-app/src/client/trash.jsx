import React, { useEffect, useState } from "react";
import axios from "axios";
import { getNoteSummary } from "./noteHelpers";
import NotePopup from "./NotePopup";

export default function Trash() {
  const [deletedNotes, setDeleteNotes] = useState([]);
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
    const fetchDeleteNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5174/trashedNotes", {
          withCredentials: true,
        });
        setDeleteNotes(response.data);
      } catch (error) {
        console.error("Error fetching archived notes:", error);
      }
    };

    fetchDeleteNotes();
  }, []);

    const handleRestore = async (e, id) => {
      e.stopPropagation();
      try{
        await axios.put(`http://localhost:5174/restoreNote/${id}`, {}, {
          withCredentials: true,
        });
        setDeleteNotes((prev) => prev.filter((note) => note._id !== id));
      } catch (err) {
        console.error("Error restoring note:", err);
      }
    }

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:5174/deleteNote/${id}`,{}, {
        withCredentials: true,
      });
      setDeleteNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <>
    <div className="newNote-container">
      <h2>Trash</h2>
      {deletedNotes.length === 0 ? (
        <p>No Deleted Notes Available.</p>
      ) : (
        <div className="notes-grid">
          {deletedNotes.map((note) => (
            <div className="card" key={note._id}>
              <div
                className="card-clickable-area"
                onClick={() => handleNoteClick(note)}
              >
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{getNoteSummary(note)}</p>
                </div>
              </div>
              <div className="card-actions">
                  <button
                    onClick={(e) => handleRestore(e, note._id)}
                    className="button-link"
                  >
                    Restore
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, note._id)}
                    className="button-link lite"
                  >
                    Delete
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
