import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { API_URL } from '../config';

const ExerciseCard = ({ exercise, deleteExercise, isDeleting }) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-body">
      <h5 className="card-title">{exercise.username}</h5>
      <p className="card-text mb-1"><strong>Description:</strong> {exercise.description}</p>
      <p className="card-text mb-1"><strong>Duration:</strong> {exercise.duration} minutes</p>
      <p className="card-text text-muted"><strong>Date:</strong> {new Date(exercise.date).toLocaleDateString()}</p>
      <div>
        <Link to={`/edit/${exercise._id}`} className="btn btn-sm btn-outline-primary me-2">
          <FaEdit className="me-1" /> Edit
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => deleteExercise(exercise._id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              Deleting...
            </>
          ) : (
            <>
              <FaTrash className="me-1" /> Delete
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.state = {
      exercises: [],
      isLoading: true,
      error: '',
      success: '',
      showConfirmModal: false,
      exerciseToDelete: null,
      isDeleting: false,
    };
  }

  componentDidMount() {
    this.loadExercises();
  }

  loadExercises() {
    this.setState({ isLoading: true, error: '' });
    axios
      .get(`${API_URL}/exercises/`)
      .then((response) => {
        this.setState({ exercises: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({
          error: 'Failed to load exercises. Please refresh the page.',
          isLoading: false,
        });
        console.error('Error fetching exercises:', error.message);
      });
  }

  confirmDelete(id) {
    this.setState({ showConfirmModal: true, exerciseToDelete: id });
  }

  cancelDelete() {
    this.setState({ showConfirmModal: false, exerciseToDelete: null });
  }

  deleteExercise(id) {
    this.setState({ isDeleting: true });
    axios
      .delete(`${API_URL}/exercises/${id}`)
      .then((response) => {
        this.setState({
          exercises: this.state.exercises.filter((el) => el._id !== id),
          showConfirmModal: false,
          exerciseToDelete: null,
          success: 'Exercise deleted successfully!',
          isDeleting: false,
        });
        // Auto-dismiss success message
        setTimeout(() => {
          this.setState({ success: '' });
        }, 3000);
      })
      .catch((error) => {
        this.setState({
          error: 'Failed to delete exercise. Please try again.',
          showConfirmModal: false,
          exerciseToDelete: null,
          isDeleting: false,
        });
        console.error('Delete failed:', error.message);
      });
  }

  render() {
    const { exercises, isLoading, error, success, showConfirmModal, exerciseToDelete, isDeleting } = this.state;

    return (
      <div className="mt-4">
        <h3 className="mb-4">Logged Exercises</h3>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => this.setState({ error: '' })}
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
              onClick={() => this.setState({ success: '' })}
              aria-label="Close"
            ></button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading exercises...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="alert alert-info">
            <strong>No exercises found.</strong> Create your first exercise log to get started!
          </div>
        ) : (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              deleteExercise={this.confirmDelete}
              isDeleting={isDeleting && exerciseToDelete === exercise._id}
            />
          ))
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
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
                    onClick={this.cancelDelete}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this exercise? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.cancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => this.deleteExercise(exerciseToDelete)}
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
}
