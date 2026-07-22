import logo from "../assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5174/register", {
        name,
        email,
        password,
      });
      navigate("/dashboard", {
        state: { user: response.data.user },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="loginHeader">
          <h3>EMPOWERING NEW JavaScript Developers</h3>
        </div>

        <div className="loginsection">
          <div className="login-image">
            <img
              src={logo}
              style={{ width: "250px", height: "auto", borderRadius: "20px" }}
              alt="site logo"
            />
          </div>

          <div id="WelcomeWords">
            <h1>Register to The Knowledge Vault</h1>
            <p>
              Welcome! Please enter your Name, Email and Password to create your
              account.
            </p>
          </div>

          <div className="login-details">
            <div id="nameTag">
              <label htmlFor="name" className="logininputs">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="input"
                placeholder="enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div id="emailTag">
              <label htmlFor="email" className="logininputs">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div id="passwordTag">
              <label htmlFor="password" className="logininputs">
                Password:
              </label>
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
              <button
                className="button"
                onClick={() =>
                  (window.location.href = "http://localhost:5174/auth/google")
                }
              >
                Sign Up with Google
              </button>
              <button className="button" onClick={handleRegister}>
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <hr />

        <div className="createAccount">
          <h1>Already have an account?</h1>
          <Link to="/" className="button-link lite">
            Login to your account
          </Link>
        </div>

        {/* <div className="footer">
          <div className="footer-links">
            <a href="#" className="button">Privacy Policy</a>
            <a href="#" className="button">Terms of Service</a>
            <a href="#" className="button">Contact Us</a>
          </div>
        </div> */}
      </div>
    </>
  );
}
