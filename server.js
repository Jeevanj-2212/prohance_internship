const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '22122002', // Change to your MySQL password
    database: 'prohance' // Change to your MySQL database name
});

connection.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow requests from any origin

// Define the hashPassword function to securely hash passwords
const saltRounds = 10; // Number of salt rounds for bcrypt
function hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

// Route to handle user signup
app.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body; // Extract name from request body

    const hashedPassword = hashPassword(password);

    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'; // Adjust SQL query to include name
    connection.query(sql, [name, email, hashedPassword, role], (error, results) => {
        if (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "An error occurred while creating user. Please try again later." });
        } else {
            res.status(200).json({ message: "User created successfully" });
        }
    });
});
// Route to handle user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT id, name, role, password FROM users WHERE email = ?';
    connection.query(sql, [email], (error, results) => {
        if (error) {
            console.error("Error finding user:", error);
            return res.status(500).json({ error: "An error occurred while finding user. Please try again later." });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            // If login is successful, return user's name and role
            res.status(200).json({ message: "Login successful", name: user.name, role: user.role });
        });
    });
});

// Route to get list of users with roles
app.get('/users', (req, res) => {
    // Query the database to get names, emails, and roles of all users
    const sql = 'SELECT id, name, email, role FROM users';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: "An error occurred while fetching users. Please try again later." });
        }

        // Send list of users with name, email, and role
        res.status(200).json(results);
    });
});

// Route to delete a user by email
app.delete('/users/:email', (req, res) => {
    const email = req.params.email;

    const sql = 'DELETE FROM users WHERE email = ?';
    connection.query(sql, [email], (error, results) => {
        if (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ error: "An error occurred while deleting user. Please try again later." });
        }

        // Send success response
        res.status(200).json({ message: "User deleted successfully" });
    });
});

// Route to update user details
app.put('/users/:email', (req, res) => {
    const email = req.params.email;
    const { name, password, role } = req.body;

    const hashedPassword = hashPassword(password);

    const sql = 'UPDATE users SET name = ?, password = ?, role = ? WHERE email = ?';
    connection.query(sql, [name, hashedPassword, role, email], (error, results) => {
        if (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ error: "An error occurred while updating user. Please try again later." });
        }

        // Send success response
        res.status(200).json({ message: "User updated successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
