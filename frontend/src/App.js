import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import SinglePost from './components/SinglePost';
import PostForm from './components/PostForm'
import { CookiesProvider } from 'react-cookie';




const App = () => {
  return (
    <CookiesProvider>
    <Router>
      <Navbar />
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/posts/:id/edit" element={<PostForm isEditMode={true} />} />
          <Route path="/create-post" element={<PostForm />} />

      </Routes>
      
    </Router>
    </CookiesProvider>
  )
}

export default App;