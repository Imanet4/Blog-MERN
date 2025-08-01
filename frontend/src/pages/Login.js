import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [, setCookie] = useCookies(['token'])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/auth/login', { email, password}, {
            withCredentials: true
          });

          //Setting the token in cookies manually as fallback
          setCookie('token', response.data.token, {
            path:'/',
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'strict' : 'lax'
          })
          navigate('/dashboard');

        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
        }
    };







  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
        <div className="card p-4 shadow-sm">
          <h2 className="text-center mb-4" style={{ color: 'var(--forest-green)' }}>
          <i className="fas fa-user-circle me-2"></i>Login</h2>


      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
    </div>
  );
  
   

};
  


export default Login;