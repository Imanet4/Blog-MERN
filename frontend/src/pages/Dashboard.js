import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token', 'username']);

  

  useEffect(() => {
      
      if (!cookies.token) {
        navigate('/login');
        return;
      }

    const fetchUser = async () => {
      try {

        const res = await axios.get('/auth/me', {
          headers: {
          'Authorization': `Bearer ${cookies.token}`,
        },
        withCredentials: true
      });

      //Setting username in cookie for Navbar to access
        setCookie('username', res.data.username, {path: '/'});
        setUser(res.data);
      } catch (err) {
        console.error('Dashboard auth check failed:', err);
        navigate('/login'); // Redirect to login if auth fails
      } finally {
        setLoading(false);
      }
    };


    fetchUser();
  }, [navigate, cookies.token]);

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }



  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4">
            <div className="text-center">
              <div className="mb-3" style={{ fontSize: '5rem' }}>
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>{user?.username}</h3>
              <p className="text-muted">{user?.email}</p>
              <hr />
              <p>Member since: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h2 style={{ color: 'var(--forest-green)' }}>
              <i className="fas fa-feather-alt me-2"></i>
              Create New Post
            </h2>
            <hr className="my-4" style={{ borderColor: 'var(--warm-brown)' }} />
            <PostForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;