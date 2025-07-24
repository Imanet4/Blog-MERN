import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const PostForm = ({isEditMode = false}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const { id } = useParams();

 // Load post data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCurrentImage(response.data.image || '');
      } catch (err) {
        console.error('Error fetching post:', err);
        navigate('/');
      }
    };

    fetchPost();
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cookies.token) {
      alert('You must be logged in to perform this action.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      if (isEditMode) {
        // Edit existing post
        await axios.put(`/posts/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        navigate(`/post/${id}`);
      } else {
        // Create new post
        const response = await axios.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        if (response.status === 201) {
          setTitle('');
          setContent('');
          setImage(null);
          alert('Post created successfully');
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.error || 
        `Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 style={{ color: 'var(--forest-green)' }}>
        <i className="fas fa-feather-alt me-2"></i>
        {isEditMode ? 'Edit Book Review' : 'Create New Book Review'}
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Image</label>
          {isEditMode && currentImage && (
            <div className="mb-2">
              <p>Current Image:</p>
              <img 
                src={`http://localhost:5000/${currentImage}`} 
                alt="Current" 
                style={{ maxHeight: '200px', marginBottom: '10px' }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{
            backgroundColor: 'var(--forest-green)',
            borderColor: 'var(--forest-green)',
            color: 'white'
          }}
        >
          {isEditMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;