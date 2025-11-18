import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const usernameRegex = /^[a-zA-Z0-9]+$/;

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
      axios.post(`${API_URL}/users/add`, user)
      .then(response => console.log(response.data)) 
      .catch(error => console.error("Error creating user:", error)); 
      setSuccess(`User "${username}" created successfully!`);
      setUsername('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(`Server error: ${err.response.data}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Create New User</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3"> 
          <label>Username: </label>
          <input
            type="text"
            required
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isSubmitting}
            placeholder="Enter username"
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className="form-group">
          <input
            type="submit"
            value={isSubmitting ? "Creating..." : "Create User"}
            className="btn btn-primary"
            disabled={isSubmitting}
          />
        </div>
      </form>
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </div>
  );
}
