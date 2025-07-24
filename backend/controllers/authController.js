const express = require('express')
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//HELPER FUNCTION TO GENERATE JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    });
}


//SIGNING UP

const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;

     // Check that all fields are filled
        if(!username || !email || !password){
        res.status(400);
        throw new Error('All fields must be filled')
        }

    // Check if user already exists
         const userExists = await User.findOne({email});
         if (userExists){
            res.status(400).json({ error: 'User already exists'})
         };   

     // Hashing password    
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

    
    // Create new user
    const user = await User.create({ 
        username,
        email, 
        password : hashedPassword 
     });

     // Send response with Token 

     res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        message: 'Successful Registration'
     });

} catch (error) {
    console.error('Registration error:', error);
    res.status(400).json(error)
 }
    
};


//LOGING IN

const login = async(req, res) => {
    const { email, password } = req.body;

    try {  

        // Checking if user exists first
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: 'User not found'});
        }

        // Checking if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error:'Invalid credentials'});

            }

        //Generate JWT Token
        const token = generateToken(user._id);

        //Setting HTTP-Only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // false in dev (HTTP works)
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // lax in dev
            maxAge: 3600000, // 1 hour expiry
    });

        //Send Back user data
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
            message: 'Login Successful'
        });


    } catch(error) {
        console.log('login error:', error);
        res.status(500).json({ error: 'Server error during login'})
    }
   
};

//LOGING OUT

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    }).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };




