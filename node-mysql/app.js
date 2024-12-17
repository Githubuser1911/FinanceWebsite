const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS
const serverless = require("serverless-http");

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS for frontend (React app running on localhost:5178)
app.use(cors({
  origin: 'http://localhost:5178', // Allow frontend to make requests to backend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.set('view engine', 'hbs');

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

module.exports.handler = serverless(app);