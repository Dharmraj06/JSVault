import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const [searchvalue, setSearchValue] = useState("");
  const [allnotes, setNotes] = useState([]);

  const Logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5174/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        console.log("user logged out!");
        navigate("/", {
          state: { user: res.data.user },
        });
      }
    } catch (error) {
      console.error("error during logout:", error);
    }
  };

  const searchNotes = async () => {
    try {
      const res = await axios.get("/AllNotes", {}, { withCrendentials: true });

      if (res.status === 200) {
        setNotes(res.data);
        console.log("fetched notes in navbar:-", res.data);
      } else{
		console.error("error in getting notes from server:",res.status);
	  }
    } catch (error) {
      console.log("error in fetching all notes in navbar :- ", error);
      alert("error in fetching all notes in navbar");
    }


	const ans = searchResult(searchvalue,allnotes);
	console.log("search result:-",ans);

  };

  function searchResult(search, notes) {
    let ans = [];

    notes.map((note) => {
      if (note.title.toLowerCase().includes(search.toLowerCase())) {
        ans.push(note);
      }
    });

    return ans; 
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg  custom-navbar">
        <div className="container-fluid">
          <img
            src={logo}
            style={{
              width: "50px",
              height: "auto",
              marginLeft: "0px",
              marginRight: "20px",
              borderRadius: "7px",
            }}
            alt="site logo"
          />
          <Link className="navbar-brand " to="/Dashboard">
            JSVault
          </Link>
          <div className="vr"></div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active button-link navbutton lite"
                  aria-current="page"
                  style={{ color: "#bd6322ff", marginLeft: "3px" }}
                  to="/dashboard"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link button-link navbutton lite"
                  to="/newNote"
                  style={{ color: "#bd6322ff" }}
                >
                  New Note
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link button-link navbutton lite"
                  to="#"
                  onClick={Logout}
                  style={{ color: "#bd6322ff" }}
                >
                  Logout
                </Link>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2 input"
                type="search"
                placeholder="Search for notes"
                aria-label="Search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button className="button" type="submit" onClick={searchNotes}>
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
