import React from "react"; // Removed useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login"; // Import Login Page
import StudentEntry from "./StudentEntry"; // Move student form to a separate component
import StudentDashboard from "./StudentDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default Page: Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/student-entry" element={<StudentEntry />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
