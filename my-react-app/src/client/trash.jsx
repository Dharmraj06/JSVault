import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

export default function Trash() {
  const [deletedNotes, setDeleteNotes] = useState([]);

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

    const handleRestore = async(id) => {
      try{
        await axios.put(`http://localhost:5174/restoreNote/${id}`, {}, {
          withCredentials: true,
        });
        setDeleteNotes((prev) => prev.filter((note) => note._id !== id));
      } catch (err) {
        console.error("Error restoring note:", err);
      }
    }

  const handleDelete = async (id) => {
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
    <div className="container">
      <h2>Trash</h2>
      {deletedNotes.length === 0 ? (
        <p>No Deleted Notes Available.</p>
      ) : (
        deletedNotes.map((note) => (
          <div className="card" style={{ width: "18rem" }} key={note._id}>
            <div className="card-body">
              <h5 className="card-title">{note.title}</h5>
              <p className="card-text">{note.codeDetails}</p>
              <button onClick={() => handleRestore(note._id)} className="button-link">
                Restore
              </button>
              <button onClick={() => handleDelete(note._id)} className="button lite">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
