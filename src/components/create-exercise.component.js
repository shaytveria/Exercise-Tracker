import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function CreateExercise() {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [durationError, setDurationError] = useState('');

  useEffect(() => {
    axios.get('https://exercise-tracker-1-lf7s.onrender.comusers/')
      .then(response => {
        if (response.data.length > 0) {
          setUsers(response.data.map(user => user.username));
          setUsername(response.data[0].username);
        }
      })
      .catch(error => console.log(error));
  }, []);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChangeDuration = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setDuration(val);
      setDurationError('');
    } else {
      setDurationError('Duration must contain only numbers');
    }
  };

  const onChangeDate = (date) => {
    setDate(date);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (duration === '' || isNaN(duration) || Number(duration) <= 0) {
      setDurationError('Duration must be a positive number');
      return;
    }

    setDurationError('');

    const exercise = {
      username,
      description,
      duration: Number(duration),
      date
    };

    console.log(exercise);

    axios.post('https://exercise-tracker-1-lf7s.onrender.com/exercises/add', exercise)
      .then(res => {
        console.log(res.data);
        window.location = '/';
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Create New Exercise Log</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <select
              required
              className="form-select"
              value={username}
              onChange={onChangeUsername}
            >
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description:</label>
            <input
              type="text"
              required
              className="form-control"
              value={description}
              onChange={onChangeDescription}
              placeholder="What did you do?"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Duration (in minutes):</label>
            <input
              type="text"
              className={`form-control ${durationError ? 'is-invalid' : ''}`}
              value={duration}
              onChange={onChangeDuration}
              placeholder="e.g. 30"
            />
            {durationError && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {durationError}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Date:</label>
            <DatePicker
              selected={date}
              onChange={onChangeDate}
              className="form-control"
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Create Exercise Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
