import logo from "../assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    let response;
    console.log(email, password);
    try {
      response = await axios.post(
        "http://localhost:5174/login",
        { email, password },
        { withCredentials: true }
      );

      navigate("/dashboard", {
        state: { user: response.data.user },
      });
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
      <div className="login-container">
        <div className="loginHeader">
          <h3>EMPOWERING NEW JavaScript Developers</h3>
        </div>

        <div className="loginsection">
          <div className="login-image">
            <img
              src={logo}
              style={{ width: "250px", height: "auto",borderRadius:"20px" }}
              alt="site logo"
            />
          </div>

          <div id="WelcomeWords">
            <h1>Log In to Your Knowledge Vault</h1>
            <p>
              Welcome Back! Please enter your email and password to access your
              notes.
            </p>
          </div>

          <div className="login-details">
            <div id="emailTag">
               <label htmlFor="email" className="logininputs">Email Address:</label>
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
            <label htmlFor="password" >Password:</label>
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
        </div>
        <hr></hr>
        <div className="createAccount">
          <h1>Don't have an account?</h1>
          <Link to="/register" className="button-link lite">
            Create an Account
          </Link>
          {/* <button className="button lite">Create an Account</button> */}
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
