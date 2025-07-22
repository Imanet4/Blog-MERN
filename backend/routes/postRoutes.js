const express = require('express');
const { createPost, getPosts,searchPosts, getSinglePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/',getPosts);
router.get('/search', searchPosts);
router.get('/:id', getSinglePost); //This must come after the search route to avoid conflicts with the search route, otherwise the search will be treated like an id.
router.delete('/:id', authMiddleware, deletePost); // Assuming you have a deletePost function in your controller



module.exports = router;