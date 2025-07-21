import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  return (
    <div className="row">
      {posts.map((post) => (
        <div key={post._id} className="col-lg-6 mb-4">
          <div className="card h-100">
            {post.image && ( 
            <img src={`http://localhost:5000/${post.image}`} 
            className="card-img-top" 
            alt={post.title}
            style={{ height: '200px', objectFit: 'cover' }}/>
            )}

            <div className="card-body">
              <h5 className="card-title" style={{ color: 'var(--warm-brown)' }}>
                {post.title}
              </h5>
              <p className="card-text text-muted">{post.content.substring(0, 150)}...</p>
              <Link to={`/post/${post._id}`} 
              className="btn btn-sm" 
              style={{ 
                  backgroundColor: 'var(--forest-green)', 
                  color: 'white' 
                }}
              
              >Read More<i className="fas fa-arrow-right ms-1"></i></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;