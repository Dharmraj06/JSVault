import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";


function Dashboard() {
const [recentNotes, setNotes] = useState([]);


useEffect(() => {
  const fetchRecentNotes = async () => {

   
    try {
      const res = await axios.post("http://localhost:5174/dashboard", { withCredentials: true });
      console.log("Type of res.data:", typeof res.data);
      console.log("Is array?", Array.isArray(res.data));
      console.log("res.data:", res.data);

      if (res.status === 200) {
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
  fetchRecentNotes();
}, []);

return (
  <>
    <div className="recent-notes">
      <h1>Recent Notes</h1>
      <ul>
        
        {recentNotes.map((note) => (
          <ul>
            <li >{note.title}</li>
            <li>{note.codeDetails}</li>
          </ul>
        ))}
      </ul>
    </div>

      <div className="manage-notes">
        <h1>Manage Notes</h1>
		<h4>Manage and organize your JavaScript learning notes.</h4>
		<ul>
		  <li><Link to="/newNote" className="button">Create New Note</Link></li>
		  <li><Link to="/allnotes" className="button lite">All Notes</Link></li>
		  <li><Link to="/archive" className="button lite">Archive</Link></li>
		</ul>
      </div>

      <div className="sidebar">
        <h1>Sidebar</h1>
        <ul>
          <li>libraries</li>
          <li>notes</li>
          <li>settings</li>
        </ul>
      </div>

      <div></div>
    </>
  );
}

export default Dashboard;
