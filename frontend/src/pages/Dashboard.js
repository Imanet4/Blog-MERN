import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PostForm from '../components/PostForm';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', { withCredentials: true });
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