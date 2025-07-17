const express = require('express');
const { createComment, getComments } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authMiddleware, createComment);
router.get('/:postId', getComments);

module.exports = router;