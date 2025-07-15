import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <div className="recent-notes">
        <h1>Recent Notes</h1>
        <ul>
          <li>Note 1</li>
          <li>Note 2</li>
          <li>Note 3</li>
        </ul>
      </div>

      <div className="manage-notes">
        <h1>Manage Notes</h1>
		<h4>Manage and organize your JavaScript learning notes.</h4>
		<ul>
		  <li><Link to="/new-note" className="button">Create New Note</Link></li>
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
