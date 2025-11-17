import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { API_URL } from '../config';

const ExerciseCard = ({ exercise, deleteExercise }) => (
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
        >
          <FaTrash className="me-1" /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);
    this.state = { exercises: [] };
  }

  componentDidMount() {
    axios
      .get(`${API_URL}/exercises/`)
      .then((response) => {
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error.message);
      });
  }

  deleteExercise(id) {
    axios
      .delete(`${API_URL}/exercises/${id}`)
      .then((response) => {
        console.log('Exercise deleted:', response.data);
        this.setState({
          exercises: this.state.exercises.filter((el) => el._id !== id),
        });
      })
      .catch((error) => {
        console.error('Delete failed:', error.message);
        alert('Failed to delete exercise. Please check the server.');
      });
  }

  render() {
    return (
      <div className="mt-4">
        <h3 className="mb-4">Logged Exercises</h3>
        {this.state.exercises.length === 0 ? (
          <div className="alert alert-info">No exercises found.</div>
        ) : (
          this.state.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              exercise={exercise}
              deleteExercise={this.deleteExercise}
            />
          ))
        )}
      </div>
    );
  }
}
