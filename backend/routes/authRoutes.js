import express from 'express';
import {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/logout', isAuthenticated, logout);
router.get('/profile', isAuthenticated, getProfile);

export default router;
