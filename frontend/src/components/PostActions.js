import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';


const PostActions = ({ post, onDelete }) => {
  const [cookies] = useCookies(['token', 'userId']);
  const navigate = useNavigate();

  //debugging 
      console.log('PostActions - Cookies:', cookies);
      console.log('PostActions - Post Author:', post.author._id);
  

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) 
      return;

    try {
      await axios.delete(`/posts/${post._id}`, {
        withCredentials: true,
      });
      
      if (onDelete) onDelete(post._id); // Call parent's deletion handler if provided
      navigate('/'); // Redirect to home after deletion
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleEdit = () => {
    navigate(`/posts/${post._id}/edit`);
  };

  // Enhanced check
  if (!cookies.userId || cookies.userId !== post.author._id.toString()) {
    console.log('Not showing buttons because:', {
      hasUserId: !!cookies.userId,
      idsMatch: cookies.userId === post.author._id.toString()
    });
    return null;
  }

  return (
    <div className="btn-group">
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={handleEdit}
      >
        Edit
      </button>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default PostActions;