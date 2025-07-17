const express = require('express');
const { createPost, getPosts,searchPosts } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/',getPosts);
router.get('/search', searchPosts);



module.exports = router;