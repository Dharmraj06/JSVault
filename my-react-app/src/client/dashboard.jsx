/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
// import Card from "./card";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [recentNotes, setNotes] = useState([]);
  const [userData, setUserData] = useState(null);  // store user data
  let userId;
  const [langlist,setlanglist] = useState([]);

  const handleDelete = async (noteId) => {
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
    const fetchRecentNotes = async () => {
      try {
        // console.log("user data:", res.data);
        console.log("user data: ",userData);
        const res = await axios.post("http://localhost:5174/dashboard",{},{withCredentials: true,});

        console.log("res.data:", res.data);
        userId = res.data[0].userId;

        if (res.status === 200) {
          setUserData(res.data.user);
          setNotes(res.data);
          console.log("Recent Notes:", res.data);
          
        } else {
          console.error("Failed to fetch recent notes:", res.statusText);
          alert("Failed to fetch recent notes. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching recent notes:", error);
        alert("Failed to fetch recent notes. Please try again later.");
      }
    };

    const fetchAllNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5174/AllNotes",{withCredentials: true});

        console.log("res.data for all notes in fetchAllNotes:",res.data);

        if(res.status === 200){
          const langlist = new Set();

          res.data.map(note => {
            langlist.add(note.language);
          })

          setlanglist(Array.from(langlist));
          console.log("language list:",Array.from(langlist));
        } else{
          console.error("Failed to fetch recent notes:", res.statusText);
          alert("Failed to fetch language list. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching Notes:", error);
        alert("Failed to fetch Notes. Please try again later.");
      }
    }
    fetchRecentNotes();
    fetchAllNotes();
  }, []);

  function openAllNotes() {
    navigate("/AllNotes", {
      state: { user: userData },
    });
  }

  function openLanguage(language) {
    navigate(`/language/${language}`,{
      state: {user: userData},
    });
  }

  return (
    <>
      <div className="dasboard">
        <div className="recent-notes">
          <h1>Recent Notes</h1>
          <ul className="recent-notes-list">
            {recentNotes.map((note, idx) => (
              <div
                className="card"
                style={{ width: "20rem", height: "auto" }}
                key={note._id || idx}
              >
                {/* <img src="..." className="card-img-top" alt="..." /> */}
                <div className="card-body">
                  <h5 className="card-title" style={{height: "72px"}}>{note.title}</h5>
                  <hr />
                  <p className="card-text">
                    {note.codeDetails.length > 200
                      ? `${note.codeDetails.slice(0, 200)}...`
                      : note.codeDetails}
                  </p>

                  <Link to={`/editNotes/${note._id}`} className="button-link">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="button-link lite"
                  >
                    Delete
                  </button>
                  <button onClick={() => handleArchive(note._id)} className="button-link lite">
                  Archive
                </button>
              </div>
              </div>
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
            <li className="button"><button className="button lite" >settings</button></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
