import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to kickNclick</h1>
      <div className="homepage-buttons">
        <Link to="/login">
          <button className="homepage-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="homepage-button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
