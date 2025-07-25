const Post = require('../models/post');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage}).single('image');

//Create a new post

const createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error:err.message || 'Error uploading file' });
        try {
            const { title, content } = req.body;
            const post = await Post.create({  //new Post instead of post.create
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

// Fetching the Posts

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
        
    } catch (err) {
        res.status(400).json({ error: err.message || 'Error fetching posts' });
        
    }
};

// Searching for posts 

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

// Geting a single post by ID

const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Error fetching post' });
    }
};

// Editing your post

const updatePost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Post not found' });
            
            // Check authorization
            if (post.author.toString() !== req.user.id) {
                return res.status(403).json({ 
                    error: 'Unauthorized: You can only edit your own posts' 
                });
            }

            const updateData = {
                title: req.body.title || post.title,
                content: req.body.content || post.content,
                updatedAt: Date.now()
            };

            // Only update image if new one is provided
            if (req.file) {
                // Delete old image if exists
                if (post.image) {
                    fs.unlink(post.image, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }
                updateData.image = req.file.path;
            } else {
                updateData.image = post.image; // Keep existing image if no new one
            }

            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            ).populate('author', 'username');

            res.json(updatedPost);
        } catch (err) {
            console.error('Update error:', err);
            res.status(400).json({ 
                error: err.message || 'Error updating post' 
            });
        }
    }); // This closing brace was missing
};

//Deleting the post by the user who created it

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        //Check if the logged in user is the author of the post

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Error deleting post' });
    }
};







module.exports = { createPost, getPosts, searchPosts, getSinglePost, deletePost, updatePost };