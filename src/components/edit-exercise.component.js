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

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/exercises/${id}`)
      .then(response => {
        setUsername(response.data.username);
        setDescription(response.data.description);
        setDuration(response.data.duration);
        setDate(new Date(response.data.date));
      })
      .catch(error => console.log(error));

    axios.get(`${API_URL}/users/`)
      .then(response => {
        if (response.data.length > 0) {
          setUsers(response.data.map(user => user.username));
        }
      })
      .catch(error => console.log(error));
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();

    const exercise = { username, description, duration, date };

    axios.post(`${API_URL}/exercises/update/${id}`, exercise)
      .then(res => {
        console.log(res.data);
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  const onDelete = () => {
    axios.delete(`${API_URL}/exercises/${id}`)
      .then(res => {
        console.log('Deleted:', res.data);
        navigate('/');
      })
      .catch(err => console.error('Error deleting exercise:', err));
  };

  return (
    <div>
      <h3>Edit Exercise Log</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select required className="form-control" value={username} onChange={e => setUsername(e.target.value)}>
            {users.map(user => <option key={user} value={user}>{user}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input type="text" required className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input type="text" className="form-control" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={date => setDate(date)} />
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
          <button type="button" onClick={onDelete} className="btn btn-danger" style={{ marginLeft: '10px' }}>
            Delete Exercise
          </button>
        </div>
      </form>
    </div>
  );
}
