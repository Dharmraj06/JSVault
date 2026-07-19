import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AllNotes() {
  //const navigate = useNavigate();
  const [allnotes, setNotes] = useState([]);
  const [alllanguge, setLanguageType] = useState(new Set());

    const handleDelete = async (noteId) => {
    try {
      const res = await axios.post(
        `http://localhost:5174/deleteNote/${noteId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    if (res.status === 200) {
      console.log("Note deleted successfully:", res.data);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
    }
  } catch (error) {
    if (error.response?.status === 401) {
      alert("Please login to delete notes");
      window.location.href = '/login';
    } else {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again later.");
    }
  }
};

const handleArchive = async(noteId) => {
    try{
      const res = await axios.post(`http://localhost:5174/archiveNote/${noteId}`, {}, {
        withCredentials: true,
      });
      if(res.status === 200){
        console.log(`Note archived: ${noteId}`);
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      } else {
        console.log("Failed to archive the note.");
      }
    } catch (error) {
      console.error("Error in archiving the note: ", error);
    }
};

  useEffect(() => {
    const fetchallnotes = async () => {
      try {
        const res = await axios.get("http://localhost:5174/AllNotes", {
          withCredentials: true,
        });

        if (res.status === 200) {
          const notes = res.data;
          setNotes(notes);

          const langSet = new Set();
          notes.forEach((note) => langSet.add(note.language));
          setLanguageType(langSet);
          console.log(langSet);
        } else {
          console.error("Failed to fetch all-notes:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching all-notes:", error);
      }
    };

    fetchallnotes();
  }, []);

  return (
    <div className="newNote-container">
      <h1>All Notes</h1>
      <ul className="list language" style={{ paddingLeft: 0 }}>
        {alllanguge &&
          Array.from(alllanguge).map((language, idx) => (
            <li key={idx} style={{ marginBottom: "2rem" }}>
              <h3 style={{ textTransform: "uppercase", borderBottom: "2px solid #FFCC57", paddingBottom: "5px" }}>{language}</h3>
              <div className="notes-grid" style={{ padding: "20px 0" }}>
                {allnotes
                  .filter((note) => note.language === language)
                  .map((note, i) => (
                    <div className="card" key={note._id || i}>
                      <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <hr />
                        <p className="card-text">
                          {note.codeDetails.length > 200
                            ? `${note.codeDetails.slice(0, 200)}...`
                            : note.codeDetails}
                        </p>

                        <div style={{ marginTop: "10px" }}>
                          <Link
                            to={`/editNotes/${note._id}`}
                            className="button-link"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="button-link lite ml-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleArchive(note._id)}
                            className="button-link lite ml-2"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
