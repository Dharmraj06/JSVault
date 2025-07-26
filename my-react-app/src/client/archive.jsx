import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

    // const handlearchive;

    fetchArchivedNotes();
  }, []);

  const handlearchive = async(noteId) => {
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
        archivedNotes.map((note) => (
          <div
              className="card"
              style={{ width: "18rem" }}
              key={note._id}
            >
              {/* <img src="..." className="card-img-top" alt="..." /> */}
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.codeDetails}</p>
                <Link to={`/editNotes/${note._id}`}  className="button-link">
                  Edit
                </Link>
                <button 
                  onClick={() => handlearchive(note._id)} 
                  className="button lite">
                  Unarchive
                </button>
              </div>
            </div>
        ))
      )}
    </div>
  );
}
