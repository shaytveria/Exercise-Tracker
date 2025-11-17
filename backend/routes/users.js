const router = require('express').Router();
let User = require('../models/user.model');

// GET all users
router.route('/').get(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error in GET /users:", err.message);
    res.status(500).json('Error: ' + err.message);
  }
});

// POST new user
router.route('/add').post(async (req, res) => {
  console.log("Received POST /users/add with body:", req.body);

  const username = req.body.username;

  if (!username) {
    console.log("No username provided");
    return res.status(400).json('Error: Username is required');
  }

  const newUser = new User({ username });

  try {
    // השימוש ב-await מבטיח שהשרת יחכה לתגובה
    await newUser.save();
    console.log("User added:", username);
    res.json('User added!');
  } catch (err) {
    console.error("Error saving user:", err.message);
    // טיפול בשגיאת אימות DB (למשל, שם משתמש כפול)
    res.status(500).json('Error: ' + err.message);
  }
});

module.exports = router;