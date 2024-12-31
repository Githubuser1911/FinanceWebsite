const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs-login"
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Failed to connect to MySQL:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL");
});

// Signup Route
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password];

    db.query(sql, [values], (err) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ status: "Error", message: "Failed to create user" });
        }
        return res.status(201).json({ status: "Success", username: req.body.name });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
    const values = [req.body.email, req.body.password];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ status: "Error", message: "Failed to fetch user" });
        }

        if (data.length > 0) {
            // Generate JWT token (if you already implemented this)
            const jwt = require('jsonwebtoken');
            const JWT_SECRET_KEY = 'your-secret-key';
            const token = jwt.sign(
                { user_id: data[0].id, username: data[0].name },
                JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                status: "Success",
                username: data[0].name,
                user_id: data[0].id,
                token: token // Include token in the response
            });
        } else {
            return res.status(401).json({ status: "Failed", message: "Invalid email or password" });
        }
    });
});


// Save Dividends Route
app.post('/save-dividends', (req, res) => {
    const { user_id, dividends } = req.body;

    // Validate user_id
    if (!user_id || typeof user_id !== 'number') {
        return res.status(400).json({
            status: "Error",
            message: "Invalid or missing 'user_id' data",
        });
    }

    // Validate dividends
    if (!dividends || !Array.isArray(dividends)) {
        return res.status(400).json({
            status: "Error",
            message: "Invalid or missing 'dividends' data",
        });
    }

    // Insert dividends into the database
    dividends.forEach(dividend => {
        const sql = "INSERT INTO dividends (`user_id`, `ticker`, `shares`, `purchase_date`, `reinvest`) VALUES (?, ?, ?, ?, ?)";
        const values = [user_id, dividend.ticker, dividend.shares, dividend.purchase_date, dividend.reinvest ? 1 : 0]; // Boolean for reinvest

        db.query(sql, values, (err) => {
            if (err) {
                console.error("Error saving dividend:", err);
                return res.status(500).json({ status: "Error", message: "Failed to save dividend" });
            }
        });
    });

    res.status(200).json({ status: "Success", message: "Data saved!" });
});



// Delete Dividend Route
app.delete('/delete-dividend', (req, res) => {
    if (!req.body.user_id || !req.body.ticker) {
        return res.status(400).json({ status: "Error", message: "Invalid or missing 'user_id' or 'ticker' data" });
    }

    const sql = "DELETE FROM dividends WHERE `user_id` = ? AND `ticker` = ?";
    const values = [req.body.user_id, req.body.ticker];

    db.query(sql, values, (err) => {
        if (err) {
            console.error("Error deleting dividend:", err);
            return res.status(500).json({ status: "Error", message: "Failed to delete data" });
        }
        return res.json({ status: "Success", message: "Dividend deleted successfully" });
    });
});

// Start the Server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

