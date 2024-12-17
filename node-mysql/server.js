const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "nodejs-login"
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(sql, [values], (err) => {
        if (err) {
            return res.json({ status: "Error", message: "Failed to create user" });
        }
        // Send back the user's name
        return res.json({ status: "Success", username: req.body.name });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
    const values = [
        req.body.email,
        req.body.password
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json({ status: "Error", message: "Failed to fetch user" });
        }
        
        if (data.length > 0) {
            // If a match is found, send back the user's name
            return res.json({ status: "Success", username: data[0].name });
        } else {
            // If no match is found, return a failure message
            return res.json({ status: "Failed", message: "No record found" });
        }
    });
});




app.listen(8081,()=>{
    console.log("Listening...");

})