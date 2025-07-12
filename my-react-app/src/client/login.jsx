import logo from "../assets/logo.png";
import { useState } from "react";
// import { Link } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5174/login", {
        email,
        password,
      });
      // If login is successful
      console.log("Login success:", res.data);
      // redirect or set token etc.
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid email or password.");
        } else {
          alert(`Error: ${error.response.status} - ${error.response.data}`);
        }
      } else {
        alert("Network or server error. Try again later.");
      }
      console.error("Login failed:", error);
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
          <button className="button" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>

      <div className="createAccount">
        <h1>Don't have an account?</h1>
        <button className="button lite">Create an Account</button>
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
