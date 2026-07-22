import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { getNoteSummary } from "./noteHelpers";
import NotePopup from "./NotePopup";

export default function LangList() {
    const { language } = useParams();
    const [allnotes, setNotes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedNote(null);
    };

    const handleDelete = async (e, noteId) => {
        e.stopPropagation();
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
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
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
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
            } else {
                console.log("Failed to archive the note.");
            }
        } catch (error) {
            console.error("Error in archiving the note:", error);
        }
    };

    useEffect(() => {
        const fetchAllNotes = async () => {
            try {
                const res = await axios.get("http://localhost:5174/AllNotes", {
                    withCredentials: true,
                });

                if (res.status === 200) {
                    const allnotes = res.data;
                    const langnotes = allnotes.filter(
                        (note) => note.language === language
                    );
                    setNotes(langnotes);
                } else {
                    console.error("Failed to fetch all-notes:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching all-notes:", error);
            }
        };

        fetchAllNotes();
    }, [language]); // re-run if param changes

    return (
        <>
        <div className="newNote-container">
            <h2>Notes for: {language}</h2>
            <div className="notes-grid">
                {allnotes.map((note, i) => (
                    <div className="card" key={note._id || i}>
                        <div
                            className="card-clickable-area"
                            onClick={() => handleNoteClick(note)}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{note.title}</h5>
                                <p className="card-language">{note.language}</p>
                                <hr />
                                <p className="card-text">{getNoteSummary(note)}</p>
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
                ))}
            </div>
        </div>
            {isPopupOpen && selectedNote && (
                <NotePopup selectedNote={selectedNote} onClose={handleClosePopup} />
            )}
        </>
    );
}
