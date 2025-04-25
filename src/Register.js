import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // Default role
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // State for success message
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:3000/register", { username, password, email, role });
            setSuccess("Registration successful! Redirecting to login page...");
            setError("");
            setTimeout(() => {
                navigate("/");
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError("Registration failed. Please try again.");
            setSuccess("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">{loading ? "Registering..." : "Register"}</button>
            </form>
        </div>
    );
};

export default Register;