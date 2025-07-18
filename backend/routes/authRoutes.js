const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, async (req, res) =>{
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
} )

module.exports = router;