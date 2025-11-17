const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://superb-daifuku-81e0a8.netlify.app', // הכתובת שלך ב-Netlify
  'https://cerulean-khapse-bd44a4.netlify.app',
  'https://dapper-daffodil-0799fc.netlify.app' // אם יש עוד אתרים
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // מאפשר requests מ־Postman / curl
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));



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


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
