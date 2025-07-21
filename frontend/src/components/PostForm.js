import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a post.');
      return;
    }


    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/posts', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  
         }
      });

      if (response.status === 201) {
        setTitle('');
        setContent('');
        console.log('Post created successfully:', response.data);
      }
    

    } catch (err) {
      console.log('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="card shadow-sm p-4">
  <h4 style={{ color: 'var(--forest-green)' }}>
    <i className="fas fa-feather-alt me-2"></i>
      Create New Book Review</h4>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Content</label>
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Image</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{
        backgroundColor: 'var(--forest-green)',
        borderColor: 'var(--forest-green)',
        color: 'white'
      }}>Create Post</button>
    </form>
    </div>
  );
};

export default PostForm;