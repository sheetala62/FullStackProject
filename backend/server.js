import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDatabase from './config/database.js';
import { errorMiddleware } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicJobRoutes from './routes/publicJobRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/jobs', publicJobRoutes); // Public jobs route (no auth required)
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Student Part-Time Job Portal API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            student: '/api/student',
            employer: '/api/employer',
            admin: '/api/admin',
        },
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    console.log('Shutting down server due to unhandled promise rejection');
    process.exit(1);
});
