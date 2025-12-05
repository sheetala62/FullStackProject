import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from './errorHandler.js';

/**
 * Middleware to check if user is authenticated
 * Verifies JWT token from cookies or Authorization header
 */
export const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const { token } = req.cookies;
        const authHeader = req.headers.authorization;

        let jwtToken = token;

        // If no cookie token, check Authorization header
        if (!jwtToken && authHeader && authHeader.startsWith('Bearer ')) {
            jwtToken = authHeader.split(' ')[1];
        }

        if (!jwtToken) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        // Verify token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

        // Get user from database
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if user is blocked
        if (req.user.isBlocked) {
            return next(new ErrorHandler('Your account has been blocked', 403));
        }

        // Check if employer is approved
        if (req.user.role === 'employer' && !req.user.isApproved) {
            return next(
                new ErrorHandler('Your account is pending approval from admin', 403)
            );
        }

        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid or expired token', 401));
    }
};

/**
 * Middleware to authorize specific roles
 * Usage: authorizeRoles('admin', 'employer')
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
