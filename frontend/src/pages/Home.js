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
    <div className="container mt-4">
      <h1>Blog Posts</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
      </div>
      <PostList posts={posts} />
    </div>
  )
};

export default Home;