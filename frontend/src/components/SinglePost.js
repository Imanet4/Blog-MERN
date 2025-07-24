import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styling/SinglePost.module.css';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(['token', 'userId']);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="container py-4 text-center">Loading...</div>;
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
            
            {/* Show actions only for post owner */}
            {post.author._id === cookies.userId && (
              <PostActions post={post} />
            )}
          </div>
        </div>
      </div>

      {/* Comments Section - Now using the CommentSection component */}
      <CommentSection postId={post._id} className={styles.commentsContainer} />
    </div>
  );
};

export default SinglePost;