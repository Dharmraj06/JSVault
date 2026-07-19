import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Settings() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5174/auth/status", {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.isAuthenticated) {
          setUserData(res.data.user);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
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
      console.error("Error logging out:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Warning: Are you absolutely sure you want to delete your account? This action is permanent and will delete all your notes."
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete("http://localhost:5174/deleteAccount", {
        withCredentials: true,
      });
      if (res.status === 200) {
        alert("Your account has been deleted successfully.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Account deletion failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="newNote-container settings-container">
        <h1>Settings</h1>
        
        {userData ? (
          <div className="settings-section" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Profile Section */}
            <div className="settings-profile-info">
              <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>Profile Details</h3>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#666" }}>Name</span>
                <p style={{ fontSize: "18px", margin: "5px 0 0 0" }}>{userData.name}</p>
              </div>
              <div className="form-group">
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#666" }}>Email Address</span>
                <p style={{ fontSize: "18px", margin: "5px 0 0 0" }}>{userData.email}</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="settings-account-actions">
              <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>Account Actions</h3>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button onClick={handleLogout} className="button-link">
                  Logout
                </button>
                <button onClick={handleDeleteAccount} className="button-link button-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading settings...</p>
        )}
      </div>
    </div>
  );
}
