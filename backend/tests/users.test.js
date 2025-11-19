const request = require('supertest');
const app = require('../server');
const User = require('../models/user.model');

describe('Users API', () => {
  test('creates a user with valid username', async () => {
    const response = await request(app)
      .post('/users/add')
      .send({ username: 'TestUser' });

    expect(response.status).toBe(200);
    expect(response.body).toBe('User added!');

    const users = await User.find();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('TestUser');
  });

  test('returns 400 when username is missing', async () => {
    const response = await request(app)
      .post('/users/add')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toBe('Error: Username is required');
  });

  test('lists all users', async () => {
    await User.create([{ username: 'User1' }, { username: 'User2' }]);

    const response = await request(app).get('/users/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((u) => u.username)).toEqual(
      expect.arrayContaining(['User1', 'User2'])
    );
  });
});

