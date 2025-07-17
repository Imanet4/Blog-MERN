import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  return (
    <div className="row">
      {posts.map((post) => (
        <div key={post._id} className="col-md-4 mb-4">
          <div className="card">
            {post.image && <img src={`http://localhost:5000/${post.image}`} className="card-img-top" alt={post.title} />}
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.content.substring(0, 100)}...</p>
              <Link to={`/post/${post._id}`} className="btn btn-primary">Read More</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;