import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
      const token = localStorage.getItem('token');

      //Then Immediate redirect if no token exists
      if (!token) {
        navigate('/login');
        return;
      }

    const fetchUser = async () => {
      try {

        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        }});



        setUser(res.data.user || JSON.parse(localStorage.getItem('user')));
      } catch (err) {
        console.error('Dashboard auth check failed:', err);
        localStorage.removeItem('token'); // Clear token on error
        navigate('/login'); // Redirect to login if auth fails
      } finally {
        setLoading(false);
      }
    };


    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }



  return (
    <div className="container py-4">
    <div className="card shadow-sm p-4">
      <h2 style={{ color: 'var(--forest-green)' }}>
        <i className="fas fa-feather-alt me-2"></i>
        Welcome back, {user?.username}!
      </h2>
      <hr className="my-4" style={{ borderColor: 'var(--warm-brown)' }} />
      <PostForm />
    </div>
  </div>
  );
};

export default Dashboard;