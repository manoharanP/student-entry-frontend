import React, { useEffect, useState } from "react"; // Ensure React and hooks are imported
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for making API calls

const StudentDashboard = () => {
  const [username, setUsername] = useState(""); // State for username
  const [profile, setProfile] = useState(null); // State to hold user profile data
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const storedUsername = localStorage.getItem("username"); // Retrieve username from local storage
    if (storedUsername) {
      setUsername(storedUsername); // Set the username state
      fetchProfile(); // Fetch profile data for the logged-in user
    } else {
      navigate("/login"); // Redirect if no user is found
    }
  }, [navigate]);

  // Function to fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setProfile(response.data); // Set the profile data received from the server
    } catch (error) {
      console.error("Error fetching profile:", error); // Log error if the request fails
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from local storage
    localStorage.removeItem("role"); // Clear role from local storage
    localStorage.removeItem("username"); // Clear username from local storage
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="dashboard-container">
      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Welcome, {username}!</h2>
      {profile && (
        <div className="profile-info">
          <h3>Your Profile</h3>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Course:</strong> {profile.course}</p>
          {/* Add more profile fields as needed */}
        </div>
      )}
      <p>This is your student dashboard.</p>
    </div>
  );
};

export default StudentDashboard;
