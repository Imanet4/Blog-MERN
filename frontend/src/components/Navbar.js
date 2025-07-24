import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Navbar = () => {

      const [cookies, , removeCookie] = useCookies(['token', 'username']);
      const navigate = useNavigate();
      const isLoggedIn = !!cookies.token;

      const handleLogout = async () => {
        try{ 
          await axios.post('/auth/logout');
        removeCookie('token');
        removeCookie('username');
        navigate('/login');
        } catch (err) {
          console.error('Logout error', err)
        }
      };

    return(
        <nav className="navbar navbar-expand-lg navbar-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-book-open me-2"></i>BookNook
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          {isLoggedIn && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
          {isLoggedIn ? (
            <>
             <span className="nav-link">Welcome, {cookies.username}</span>
              <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
            </>
          ) : ( 
          
          <Link className="nav-link" to="/login">Login</Link>

          )}
        </div>
      </div>
    </nav>
    )
};

export default Navbar;