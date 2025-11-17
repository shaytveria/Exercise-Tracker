const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// מאפשר קריאות גם מ-localhost וגם מה-frontend בענן
app.use(cors({
  origin: ['http://localhost:3000', 'https://exercise-tracker.netlify.app'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// חיבור ל-MongoDB
const uri = process.env.ATLAS_URI;
if (uri) {
  mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
      console.error("MongoDB connection error:", err.message);
      console.error("Server will continue to run, but database operations will fail.");
    });

  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
  });
} else {
  console.warn("WARNING: ATLAS_URI is not defined in .env file");
  console.warn("Server will continue to run, but database operations will fail.");
  console.warn("Please create a .env file with ATLAS_URI=mongodb://your-connection-string");
}

// Routes
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client')));

// "Catchall" handler: send back React's index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
app.use(cors()); // מאפשר כל מקור
