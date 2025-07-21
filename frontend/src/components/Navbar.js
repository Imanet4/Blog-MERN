import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-book-open me-2"></i>BookNook
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/login">Login</Link>
        </div>
      </div>
    </nav>
    )
};

export default Navbar;