const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as needed
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect("mongodb://localhost:27017/Blog-API")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));