/* eslint-disable no-unused-vars */
import logo from "../assets/logo.png";
import { useState } from "react";
// import { Link } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async () => {
    //send the data to backend
    let response;
	console.log(email, password);
    try {
      response = await axios.post(
        "http://localhost:5174/login",
        { email, password },
        { withCredentials: true }
      );
	  
    } catch (error) {
      console.error("Login failed:", error.message);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
      }
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="loginHeader">
        <h2>EMPOWERING NEW JavaScript Developers</h2>
      </div>

      <div>
        <div className="login-image">
          <img src={logo} alt="site logo" />
        </div>

        <div>
          <h1>Log In to Your Knowledge Vault</h1>
          <p>
            Welcome Back! Please enter your email and password to access your
            notes.
          </p>
        </div>

        <div className="login-details">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            className="input"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-btn">
          <button className="button">Log In with Google</button>
          <button className="button" onClick={handlelogin}>
            Log In
          </button>
        </div>
      </div>

      <div className="createAccount">
        <h1>Don't have an account?</h1>
        <link to="/register" className="button lite">
          Create an Account
          </link>
        {/* //<button className="button lite">Create an Account</button> */}
      </div>

      <div className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </>
  );
}
