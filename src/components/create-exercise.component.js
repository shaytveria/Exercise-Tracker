import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from '../config';

export default function CreateExercise() {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [durationError, setDurationError] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setIsLoadingUsers(true);
    setUsersError('');
    axios
      .get(`${API_URL}/users/`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setUsers(response.data.map((user) => user.username));
          setUsername(response.data[0].username);
        } else {
          setUsersError('No users found. Please create a user first.');
        }
        setIsLoadingUsers(false);
      })
      .catch((error) => {
        setUsersError('Failed to load users. Please refresh the page.');
        setIsLoadingUsers(false);
        console.error('Error fetching users:', error);
      });
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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (duration === '' || isNaN(duration) || Number(duration) <= 0) {
      setDurationError('Duration must be a positive number');
      return;
    }

    setDurationError('');
    setSubmitError('');
    setIsSubmitting(true);

    const exercise = {
      username,
      description,
      duration: Number(duration),
      date,
    };

    try {
      await axios.post(`${API_URL}/exercises/add`, exercise);
      window.location = '/';
    } catch (err) {
      setSubmitError(
        err.response?.data || 'Failed to create exercise. Please try again.'
      );
      setIsSubmitting(false);
      console.error('Error adding exercise:', err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Create New Exercise Log</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            {isLoadingUsers ? (
              <div className="form-control">
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Loading users...
              </div>
            ) : (
              <>
                <select
                  required
                  className={`form-select ${usersError ? 'is-invalid' : ''}`}
                  value={username}
                  onChange={onChangeUsername}
                  disabled={users.length === 0 || isSubmitting}
                >
                  <option value="">Select user...</option>
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
                {usersError && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {usersError}
                  </div>
                )}
                {users.length === 0 && !usersError && (
                  <div className="form-text text-danger">
                    No users loaded. Make sure you created a user successfully.
                  </div>
                )}
              </>
            )}
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

          {submitError && (
            <div className="alert alert-danger mb-3" role="alert">
              <strong>Error:</strong> {submitError}
            </div>
          )}

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isLoadingUsers || users.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating...
                </>
              ) : (
                'Create Exercise Log'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}