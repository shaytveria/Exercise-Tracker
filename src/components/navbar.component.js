import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link to="/" className="navbar-brand">Exercise Tracker</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav mx-auto"> {/* מרכז את הרשימה */}
            <li className="nav-item">
              <Link to="/" className="nav-link">Exercises</Link>
            </li>
            <li className="nav-item">
              <Link to="/create" className="nav-link">Create Exercise</Link>
            </li>
            <li className="nav-item">
              <Link to="/user" className="nav-link">Create User</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
