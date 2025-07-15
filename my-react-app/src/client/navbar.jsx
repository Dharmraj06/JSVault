import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <>
            {/* {code to add logo of the site } */}
            <nav className="navbar">
                <div className="logo">

                    </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/dashboard">Home</Link>
                    </li>
                    <li>
                        <Link to="/newNote">New Note</Link>
                    </li>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                </ul>
                <hr />
            </nav>
        </>
    )
}