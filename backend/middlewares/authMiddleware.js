const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authMiddleware = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
    
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }   
        
    if (!token){
        return res.status(401).json({ error: 'Not Authorized, no token provided'});
        }

    try{     

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();

    }catch (error) {
        console.error('JWT Error',error);

        let errorMessage = 'Not authorized, token failed';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Session expired, please login again';
       } else if (error.name === 'JsonWebTokenError') {
              errorMessage = 'Invalid Token'
       }


            res.status(401).json({ error: errorMessage });
        }
    };
    






module.exports = authMiddleware;