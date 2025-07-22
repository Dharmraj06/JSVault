import logo from "../assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    let response;

    try {
      response = await axios.post("http://localhost:5174/register", {
        name,
        email,
        password,
      });
      navigate("/dashboard", {
        state: { user: response.data.user },
      });
    } catch (error) {
      console.error("Registeration failed:", error);
      alert("Registeration failed. Please try again.");
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
          <h1>Register to The Knowledge Vault</h1>
          <p>
            Welcome! Please enter your Name, email and password to make your
            account
          </p>
        </div>

        <div className="login-details">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="input"
            placeholder="enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
          <button className="button">Sign Up with Google</button>
          <button className="button" onClick={handleRegister}>
            Sign Up
          </button>
        </div>
      </div>

      <div className="createAccount">
        <h1>Already have an account?</h1>
        <Link to="/" className="button lite">
          Login to your account
        </Link>
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
