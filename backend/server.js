const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// רשימת הדומיינים שמורשים לשלוח בקשות
const allowedOrigins = [
  'http://localhost:3000', // לפיתוח מקומי
  'https://superb-daifuku-81e0a8.netlify.app',
  'https://cerulean-khapse-bd44a4.netlify.app',
  'https://effulgent-lolly-3a011d.netlify.app'
];

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
}));
;

app.use(express.json());

// חיבור ל-MongoDB
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.warn("WARNING: ATLAS_URI is not defined in .env file");
} else {
  mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err.message));
}

// Routes
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// "Catchall" handler: send back React's index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
