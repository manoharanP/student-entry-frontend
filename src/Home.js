import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to StudentApp</h1>
                <p>Your gateway to managing student information efficiently.</p>
                <div className="home-buttons">
                    <Link to="/login" className="home-button">Login</Link>
                    <Link to="/register" className="home-button">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;