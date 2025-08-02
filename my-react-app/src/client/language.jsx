import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LangList() {
    const { language } = useParams();
    const [allnotes, setNotes] = useState([]);

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

    const handleArchive = async (noteId) => {
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
        <div className="language-container">
            <h2>Notes for: {language}</h2>
            <ul className="list language">
                {allnotes.map((note, i) => (
                    <li key={i}>
                        <div className="card" style={{ width: "20rem", height: "auto" }}>
                            <div className="card-body">
                                <h5 className="card-title">{note.title}</h5>
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
        </div>
    );
}
