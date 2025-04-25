const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env file
const SECRET_KEY = process.env.SECRET_KEY || "fallback_random_secret"; // Use secret key from .env or fallback

const app = express();
app.use(express.json()); // To parse JSON requests
app.use(cors()); // Allow cross-origin requests

// Create a MySQL Connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "nodejs_user",
//     password: "M@no$040710",
//     database: "student_db"
// });
const db = mysql.createConnection({
    host: "mysql",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database!");
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Store user info in request
        next();
    });
};

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// User Registration Route (For Admin to add new users)
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
        [username, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully" });
        }
    );
});

// User Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token, role: user.role });
        });
    });
});

// API to List All Users (Admin Only)
app.get("/users", authenticateToken, checkAdmin, (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// API to Update Student Data (Admin Only)
app.put("/students/:id", authenticateToken, checkAdmin, (req, res) => {
    const { name, email, age, course } = req.body;
    const sql = "UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?";
    db.query(sql, [name, email, age, course, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student updated successfully!" });
    });
});

// Start the Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
