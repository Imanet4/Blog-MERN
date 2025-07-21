import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import PostList from '../components/PostList';


const Home = () => {

    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get('http://localhost:5000/posts');
            setPosts(res.data);
        };
        fetchPosts();
    }, []);

    const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/posts/search?query=${searchQuery}`);
    setPosts(res.data);
  };






  return (
   <div className="container py-4">
    <div className="text-center mb-5">
      <h1 className="display-4" style={{ color: 'var(--forest-green)' }}>
        <i className="fas fa-book me-2"></i>BookNook Blog
      </h1>
      <p className="lead text-muted">
        Discover literary gems and share your thoughts
      </p>
    </div>

    <div className="row justify-content-center mb-4">
      <div className="col-md-8">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search book reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="btn" 
            onClick={handleSearch}
            style={{ backgroundColor: 'var(--warm-brown)', color: 'white' }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <PostList posts={posts} />
  </div>
  )
};

export default Home;