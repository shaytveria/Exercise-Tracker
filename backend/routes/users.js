const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => {
      console.error("Error in GET /users:", err.message);
      res.status(500).json('Error: ' + err.message);
    });
});

router.route('/add').post((req, res) => {
  console.log("Received POST /users/add with body:", req.body);

  const username = req.body.username;

  if (!username) {
    console.log("No username provided");
    return res.status(400).json('Error: Username is required');
  }

  const newUser = new User({ username });

  newUser.save()
    .then(() => {
      console.log("User added:", username);
      res.json('User added!');
    })
    .catch(err => {
      console.error("Error saving user:", err.message);
      res.status(500).json('Error: ' + err.message);
    });
});

module.exports = router;
