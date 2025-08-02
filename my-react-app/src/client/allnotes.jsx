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
    <div className="language-container">
      <ul className="list language">
        {alllanguge &&
          Array.from(alllanguge).map((language, idx) => (
            <li key={idx}>
              {language}
              <ul>
                {allnotes
                  .filter((note) => note.language === language)
                  .map((note, i) => (
                    <li key={i}>
                      <div
                        className="card"
                        style={{ width: "20rem", height: "auto" }}
                        key={note._id || idx}
                      >
                        {/* <img src="..." className="card-img-top" alt="..." /> */}
                        <div className="card-body">
                          <h5 className="card-title">{note.title}</h5>
                          <hr />
                          <p className="card-text">
                            {note.codeDetails.length > 200
                              ? `${note.codeDetails.slice(0, 200)}...`
                              : note.codeDetails}
                          </p>

                          <Link
                            to={`/editNotes/${note._id}`}
                            className="button-link"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="button-link lite"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleArchive(note._id)}
                            className="button-link lite"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}
