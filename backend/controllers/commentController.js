const Comment = require('../models/comment');

const createComment = async (req, res) => {
    try {
        const { text, postId } = req.body;
        const comment = await Comment.create({
            text,
            author: req.user.id,
            post: postId,
        });
        res.json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Error creating comment' });
    }
};


const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.json(comments);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Error fetching comments' });
    }
};

module.exports = { createComment, getComments };