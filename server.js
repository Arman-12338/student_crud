import express from 'express';
import dotenv from 'dotenv';
import dns from 'dns';
import connectDB from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';

// Force DNS resolution to prefer IPv4 (fixes querySrv ECONNREFUSED on Windows/Node 17+)
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Body parser middleware to process incoming JSON payloads
app.use(express.json());

// API Base Route mapping
app.use('/api/students', studentRoutes);

// Fallback Route for handling 404 (Not Found) resources
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Global Error Handler Middleware
app.use((err, req, res, next) => {
  // If the status code is still 200, default it to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 1. Handle Invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid MongoDB ID format';
  }

  // 2. Handle Mongoose Schema Validation Failures (e.g. missing required fields, regex match failure)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // 3. Handle MongoDB Duplicate Key Errors (e.g. duplicate unique email)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email address already exists. Please use a unique email.';
  }

  // Send the JSON error response
  res.status(statusCode).json({
    message,
    // Stack trace is only exposed in development environment for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
