import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`http://localhost:5000/comments/${postId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/comments',
        { text, postId },
        { withCredentials: true }
      );
      setText('');
      const res = await axios.get(`http://localhost:5000/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    }
  };

  return (
    <div className="mt-4">
      <h4>Comments</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <div className="mt-3">
        {comments.map((comment) => (
          <div key={comment._id} className="card mb-2">
            <div className="card-body">
              <p className="card-text">{comment.text}</p>
              <small>By: {comment.author.username}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;