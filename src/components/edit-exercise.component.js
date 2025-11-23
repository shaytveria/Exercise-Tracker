import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function EditExercise() {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError('');

    Promise.all([
      axios.get(`${API_URL}/exercises/${id}`),
      axios.get(`${API_URL}/users/`)
    ])
      .then(([exerciseResponse, usersResponse]) => {
        const exercise = exerciseResponse.data;
        setUsername(exercise.username);
        setDescription(exercise.description);
        setDuration(exercise.duration);
        setDate(new Date(exercise.date));

        if (usersResponse.data.length > 0) {
          setUsers(usersResponse.data.map(user => user.username));
        }
        setIsLoading(false);
      })
      .catch(error => {
        setError('Failed to load exercise data. Please try again.');
        setIsLoading(false);
        console.error('Error loading data:', error);
      });
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const exercise = { username, description, duration, date };

    try {
      await axios.post(`${API_URL}/exercises/update/${id}`, exercise);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Failed to update exercise. Please try again.');
      setIsSubmitting(false);
      console.error('Error updating exercise:', err);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/exercises/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete exercise. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
      console.error('Error deleting exercise:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading exercise data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Edit Exercise Log</h3>

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

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <select
              required
              className="form-select"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isSubmitting || isDeleting}
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
              onChange={e => setDescription(e.target.value)}
              disabled={isSubmitting || isDeleting}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Duration (in minutes):</label>
            <input
              type="text"
              className="form-control"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              disabled={isSubmitting || isDeleting}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date:</label>
            <DatePicker
              selected={date}
              onChange={date => setDate(date)}
              className="form-control"
              disabled={isSubmitting || isDeleting}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                'Update Exercise Log'
              )}
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="btn btn-danger"
              disabled={isSubmitting || isDeleting}
            >
              Delete Exercise
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  aria-label="Close"
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this exercise? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
