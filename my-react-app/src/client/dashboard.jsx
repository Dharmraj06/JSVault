/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./public/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [recentNotes, setNotes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [langlist, setlanglist] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `http://localhost:5174/tempDeleteNote/${noteId}`,
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
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login to delete notes");
        window.location.href = "/login";
      } else {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again later.");
      }
    }
  };

  const handleArchive = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        `http://localhost:5174/archiveNote/${noteId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log(`Note archived: ${noteId}`);
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
      } else {
        console.log("Failed to archive the note.");
      }
    } catch (error) {
      console.error("Error in archiving the note: ", error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedNote(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5174/auth/status", {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.isAuthenticated) {
          setUserData(res.data.user);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        navigate("/");
      }
    };

    const fetchRecentNotes = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5174/dashboard",
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          setNotes(res.data);
          console.log("Recent Notes:", res.data);
        } else {
          console.error("Failed to fetch recent notes:", res.statusText);
          alert("Failed to fetch recent notes. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching recent notes:", error);
        if (error.response?.status === 401) {
          navigate("/");
        } else {
          alert("Failed to fetch recent notes. Please try again later.");
        }
      }
    };

    const fetchAllNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5174/AllNotes", {
          withCredentials: true,
        });
        if (res.status === 200) {
          const langlist = new Set();
          res.data.map((note) => {
            langlist.add(note.language);
          });
          setlanglist(Array.from(langlist));
        } else {
          console.error("Failed to fetch recent notes:", res.statusText);
          alert("Failed to fetch language list. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching Notes:", error);
        alert("Failed to fetch Notes. Please try again later.");
      }
    };
    fetchUserData();
    fetchRecentNotes();
    fetchAllNotes();
  }, []);

  function openAllNotes() {
    navigate("/AllNotes", {
      state: { user: userData },
    });
  }

  function openLanguage(language) {
    navigate(`/language/${language}`, {
      state: { user: userData },
    });
  }

  return (
    <>
      <div className="dasboard">
        <div className="recent-notes">
          <h1>Recent Notes</h1>
          <ul className="recent-notes-list">
            {recentNotes.map((note, idx) => (
              <li key={note._id || idx}>
                
                <div
                  className="card"
                  style={{ width: "20rem", height: "auto" }}
                >
                  <div
                    className="card-clickable-area"
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="card-body">
                      <h5 className="card-title" style={{height:"72px"}}>{note.title}</h5>
                      <hr />
                      <p className="card-text">
                        {note.codeDetails.length > 200
                          ? `${note.codeDetails.slice(0, 200)}...`
                          : note.codeDetails}
                      </p>
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
                      onClick={(e) => handleDelete(e, note._id)}
                      className="button-link lite"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => handleArchive(e, note._id)}
                      className="button-link lite"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="manage-notes">
          <h1>Manage Notes</h1>
          <h4>Manage and organize your JavaScript learning notes.</h4>
          <ul className="manage-notes-buttons">
            <li id="newnote">
              <Link to="/newNote" className="button-link">
                Create New Note
              </Link>
            </li>
            <li id="allnotes">
              <Link
                to="/allnotes"
                className="button-link lite"
                onClick={openAllNotes}
              >
                All Notes
              </Link>
            </li>
            <li id="archive">
              <Link to="/archivedNotes" className="button-link lite">
                Archive
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar">
          <h1> </h1>
          <ul>
            {/* <li className="button">libraries</li> */}
            
              {
                langlist.map(lang => {
                  return <li className="button lite"><button className="button lite" onClick={() => openLanguage(lang)}>{lang}</button></li>
                })
              }
          <hr />
            <li className="button"><button className="button lite" onClick={() => navigate("/Trash")}>trash</button></li>
            <li className="button"><button className="button lite" onClick={() => navigate("/settings")}>settings</button></li>
          </ul>
        </div>
      </div>
      

      {isPopupOpen && selectedNote && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2 className="popup-title">{selectedNote.title}</h2>
              <button className="popup-close-btn" onClick={handleClosePopup}>
                x
              </button>
            </div>

            <div className="popup-details">
              <div className="detail-item">
                <span className="detail-label">Language:</span>
                <span className="detail-value">{selectedNote.language}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tags:</span>
                <span className="detail-value">
                  {selectedNote.tags ? selectedNote.tags.join(", ") : "No tags"}
                </span>
              </div>
            </div>


            <div className="popup-code-block">
              <h4 className="code-heading">Code:</h4>
              <pre>{selectedNote.code}</pre>
            </div>
            
            <div className="popup-description">
              <h4 className="description-heading">Code Details:</h4>
              <p>{selectedNote.codeDetails}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
