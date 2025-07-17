const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



//SIGNING UP

const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET,
            {expiresIn: '1h'});
            res.cookie('token', token,{httpOnly: true}).json({ user });
        }catch(err) {
            res.status(400).json({ error: err.message || 'Registration failed' })
    }
};


//LOGING IN

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) throw new Error('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true}).json({ user });
        
    } catch (error) {
        res.status(400).json({ error: error.message || 'Login failed' });
        
    }
};

//LOGING OUT

const logout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };



