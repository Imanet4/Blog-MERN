import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login',
                {email, password})

                //Store both token and user data in localStorage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                navigate('/dashboard');
        } catch (err) {
            alert('Login failed');
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
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
    </div>
  );
  
   

};
  


export default Login