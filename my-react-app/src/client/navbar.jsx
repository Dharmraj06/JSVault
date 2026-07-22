import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // We keep a reference to the debounce timer so we can clear it
  const debounceTimer = useRef(null);

  // Runs whenever the user types in the search box.
  // Waits 400ms after the last keystroke before firing the API request.
  useEffect(() => {
    // Clear any previous timer so we only fire after the user stops typing
    clearTimeout(debounceTimer.current);

    const query = searchValue.trim();

    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `http://localhost:5174/notes?search=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setSearchResults(res.data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search request failed:", error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    // Cleanup: cancel pending timer if searchValue changes again before it fires
    return () => clearTimeout(debounceTimer.current);
  }, [searchValue]);

  const handleResultClick = (noteId) => {
    setShowDropdown(false);
    setSearchValue("");
    navigate(`/editNotes/${noteId}`);
  };

  const handleSearchBlur = () => {
    // Short delay so a click on a dropdown item fires before the dropdown hides
    setTimeout(() => setShowDropdown(false), 150);
  };

  const Logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5174/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar">
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
          <Link className="navbar-brand" to="/dashboard">
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

            {/* Search bar with live dropdown results */}
            <div className="navbar-search-wrap">
              <form
                className="d-flex"
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  id="navbar-search"
                  className="form-control me-2 input"
                  type="search"
                  placeholder="Search by title or tags..."
                  aria-label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  onBlur={handleSearchBlur}
                  autoComplete="off"
                />
                {isSearching && (
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    ...
                  </span>
                )}
              </form>

              {/* Dropdown results list */}
              {showDropdown && searchResults.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "#ffffff",
                    border: "1px solid #FFCC57",
                    borderRadius: "10px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                    zIndex: 1050,
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "6px 0",
                    listStyle: "none",
                    margin: 0,
                    minWidth: "260px",
                  }}
                >
                  {searchResults.map((note) => (
                    <li
                      key={note._id}
                      onMouseDown={() => handleResultClick(note._id)}
                      style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f5f5f5",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FFFBEA")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "700",
                          fontSize: "14px",
                          color: "#222",
                        }}
                      >
                        {note.title}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "12px",
                          color: "#888",
                        }}
                      >
                        {note.language}
                        {note.tags && note.tags.length > 0
                          ? ` · ${note.tags.join(", ")}`
                          : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {/* No results message */}
              {showDropdown && searchValue.trim() && searchResults.length === 0 && !isSearching && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    backgroundColor: "#ffffff",
                    border: "1px solid #FFCC57",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    zIndex: 1050,
                    fontSize: "13px",
                    color: "#888",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    minWidth: "260px",
                  }}
                >
                  No notes found for &quot;{searchValue}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
