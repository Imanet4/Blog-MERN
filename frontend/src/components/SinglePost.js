import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styling/SinglePost.module.css'


const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetching post data
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(response.data);

        // Fetching comments for the post
        const commentsResponse = await axios.get(`http://localhost:5000/comments/${id}`);
        setComments(commentsResponse.data);

      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post data');
        
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
       await axios.post(`http://localhost:5000/comments`, {
        text: newComment,
        postId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Refetching comments to get the updated list with populated author
      const commentsResponse = await axios.get(`http://localhost:5000/comments/${id}`);
      setComments(commentsResponse.data);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again later.');
    } finally {
      setCommentLoading(false);
    }
  };


  if (loading) return <div className="container py-4 text-center">Loading...</div>;;
  if (!post) return <div className="container py-4">Post not found</div>;

  return (
<div className="container py-4">
      {/* Main Post Card */}
      <div className={`card ${styles.postCard}`}>
        <div className="card-body p-5">
          <h1 className={styles.postTitle}>{post.title}</h1>
          
          {post.image && (
            <img
              src={`http://localhost:5000/${post.image}`}
              alt={post.title}
              className={`img-fluid rounded mb-4 ${styles.postImage}`}
            />
          )}
          
          <div className={styles.postContent}>
            {post.content}
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <div>
              <span className="text-muted">Posted by </span>
              <span className="fw-bold text-success">{post.author?.username}</span>
              {post.createdAt && (
                <span className="text-muted ms-3">
                  on {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
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
              <form onSubmit={handleCommentSubmit}>
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

          {comments.length > 0 ? (
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
    </div>
  );
};



export default SinglePost;