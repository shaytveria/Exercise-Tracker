const request = require('supertest');
const app = require('../server');
const Exercise = require('../models/exercise.model');
const User = require('../models/user.model');

describe('Exercises API', () => {
  let username;

  beforeEach(async () => {
    const user = await User.create({ username: 'Runner' });
    username = user.username;
  });

  test('creates a new exercise', async () => {
    const exercisePayload = {
      username,
      description: 'Morning run',
      duration: 30,
      date: new Date().toISOString()
    };

    const response = await request(app)
      .post('/exercises/add')
      .send(exercisePayload);

    expect(response.status).toBe(200);
    expect(response.body).toBe('Exercise added!');

    const exercises = await Exercise.find();
    expect(exercises).toHaveLength(1);
    expect(exercises[0].description).toBe('Morning run');
  });

  test('returns 400 on invalid duration', async () => {
    const response = await request(app)
      .post('/exercises/add')
      .send({
        username,
        description: 'Bad duration',
        duration: 'abc',
        date: new Date().toISOString()
      });

    expect(response.status).toBe(400);
    expect(response.body).toBe('Error: Invalid input data');
  });

  test('updates an existing exercise', async () => {
    const exercise = await Exercise.create({
      username,
      description: 'Old desc',
      duration: 10,
      date: new Date()
    });

    const response = await request(app)
      .post(`/exercises/update/${exercise._id}`)
      .send({
        username,
        description: 'Updated desc',
        duration: 45,
        date: new Date().toISOString()
      });

    expect(response.status).toBe(200);
    expect(response.body).toBe('Exercise updated!');

    const updated = await Exercise.findById(exercise._id);
    expect(updated.description).toBe('Updated desc');
    expect(updated.duration).toBe(45);
  });

  test('deletes an exercise', async () => {
    const exercise = await Exercise.create({
      username,
      description: 'To delete',
      duration: 20,
      date: new Date()
    });

    const response = await request(app).delete(`/exercises/${exercise._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toBe('Exercise deleted.');

    const remaining = await Exercise.find();
    expect(remaining).toHaveLength(0);
  });
});

