import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PostForm from '../components/PostForm';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', { 
          withCredentials: true,
          headers: {
          Authorization: `Bearer ${getCookie('token')}`

        } 
      });
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.username}!</p>}
      <PostForm />
    </div>
  );
};

export default Dashboard;