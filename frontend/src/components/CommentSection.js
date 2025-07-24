// components/CommentSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import styles from '../Styling/SinglePost.module.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/comments',
        { text: newComment, postId },
        { 
          headers: { 
            'Authorization': `Bearer ${cookies.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const res = await axios.get(`http://localhost:5000/comments/${postId}`);
      setComments(res.data);
      setNewComment('');
      setShowCommentForm(false);
    } catch (err) {
      setError('Failed to submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className={`card mb-4 ${styles.commentsContainer}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h4 mb-0">
            Comments <span className="badge bg-secondary">{comments.length}</span>
          </h3>
          <button 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="btn btn-sm btn-outline-success"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        </div>

        {showCommentForm && (
          <div className={`mb-4 ${styles.commentForm}`}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  style={{ resize: 'none' }}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={commentLoading}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
              {error && <div className="text-danger mt-2">{error}</div>}
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="mt-3">
            {comments.map(comment => (
              <div key={comment._id} className={`card mb-3 ${styles.commentCard}`}>
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="card-title mb-0 fw-bold">
                      {comment.author?.username || 'Anonymous'}
                    </h6>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="card-text">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;