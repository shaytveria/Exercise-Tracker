import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9]+$/;

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // איפוס הודעות
    setError('');
    setSuccess('');

    // ולידציה
    if (!usernameRegex.test(username)) {
      setError('Username can contain only letters and numbers without spaces or special characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = { username };
      const response = await axios.post(`${API_URL}/users/add`, user);
      setSuccess(`User "${username}" created successfully!`);
      setUsername('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(`Server error: ${err.response.data}`);
      } else if (err.response && err.response.status === 400) {
        setError('Username already exists or is invalid. Please try a different username.');
      } else {
        setError(`Error: ${err.message || 'Failed to create user. Please try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Create New User</h3>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess('')}
              aria-label="Close"
            ></button>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              required
              className={`form-control ${error ? 'is-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter username (letters and numbers only)"
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
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
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
