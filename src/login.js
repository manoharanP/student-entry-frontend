import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [usernames, setUsernames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsernames = JSON.parse(localStorage.getItem("usernames")) || [];
        setUsernames(savedUsernames);
        if (savedUsernames.length > 0) {
            setUsername(savedUsernames[0]); // Set the first username as the default
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/login", { username, password });
            const { token, role } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Save the username to local storage
            const updatedUsernames = [...new Set([username, ...usernames])]; // Ensure unique usernames
            localStorage.setItem("usernames", JSON.stringify(updatedUsernames));

            if (role === "Admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/student-dashboard");
            }
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        list="usernames"
                        required
                    />
                    <datalist id="usernames">
                        {usernames.map((name, index) => (
                            <option key={index} value={name} />
                        ))}
                    </datalist>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
