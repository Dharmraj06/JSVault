import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AllNotes() {
  //const navigate = useNavigate();
  const [allnotes, setNotes] = useState([]);
  const [alllanguge, setLanguageType] = useState(new Set());

  useEffect(() => {
    const fetchallnotes = async () => {
      try {
        const res = await axios.get("http://localhost:5174/AllNotes", { withCredentials: true });

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
                        style={{ width: "18rem" }}
                        key={note._id || idx}
                      >
                        {/* //<img src="..." className="card-img-top" alt="..." /> */}
                        <div className="card-body">
                          <h5 className="card-title">{note.title}</h5>
                          <p className="card-text">{note.codeDetails}</p>
                          <Link
                            to={`/editNotes/${note._id}`}
                            className="button"
                          >
                            Edit
                          </Link>
                          <a href="#" className="button lite">
                            Delete
                          </a>
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
