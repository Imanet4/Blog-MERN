const Post = require('../models/post');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage}).single('image');

const createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error:err.message || 'Error uploading file' });
        try {
            const { title, content } = req.body;
            const post = await Post.create({
                title,
                content,
                image: req.file ? req.file.path : null,
                author: req.user.id,
            });
            res.status(201).json(post);
        }catch (err){
            res.status(400).json({ error: err.message || 'Error creating post' });
        }
    });
};


const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
        
    } catch (err) {
        res.status(400).json({ error: err.message || 'Error fetching posts' });
        
    }
};

const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ],
        }).populate('author', 'username');
        res.json(posts);
        
    } catch (err) {
        res.status(400).json({ error: err.message || 'Error searching posts' });
    }
};






module.exports = { createPost, getPosts, searchPosts };