const router = require('express').Router();
let Exercise = require('../models/exercise.model');

// GET כל התרגילים
router.route('/').get(async (req, res) => {
  try {
    const exercises = await Exercise.find();
    return res.json(exercises);
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

// POST הוספת תרגיל חדש
router.route('/add').post(async (req, res) => {
  try {
    const { username, description, duration, date } = req.body;
    const durationNum = Number(duration);
    const dateParsed = Date.parse(date);

    if (!username || !description || isNaN(durationNum) || isNaN(dateParsed)) {
      return res.status(400).json('Error: Invalid input data');
    }

    const newExercise = new Exercise({
      username,
      description,
      duration: durationNum,
      date: dateParsed,
    });

    await newExercise.save();
    return res.json('Exercise added!');
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

// GET תרגיל לפי id
router.route('/:id').get(async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json('Error: Exercise not found');
    return res.json(exercise);
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

// DELETE תרגיל לפי id
router.route('/:id').delete(async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) return res.status(404).json('Error: Exercise not found');
    return res.json('Exercise deleted.');
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

// POST עדכון תרגיל לפי id
router.route('/update/:id').post(async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json('Error: Exercise not found');

    const { username, description, duration, date } = req.body;
    const durationNum = Number(duration);
    const dateParsed = Date.parse(date);

    if (!username || !description || isNaN(durationNum) || isNaN(dateParsed)) {
      return res.status(400).json('Error: Invalid input data');
    }

    exercise.username = username;
    exercise.description = description;
    exercise.duration = durationNum;
    exercise.date = dateParsed;

    await exercise.save();
    return res.json('Exercise updated!');
  } catch (err) {
    return res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
