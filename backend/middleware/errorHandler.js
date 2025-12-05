/**
 * Custom Error Handler Class
 * Extends the built-in Error class with status code
 */
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error Middleware
 * Centralized error handling for the application
 */
export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `${field} already exists`;
        err = new ErrorHandler(message, 400);
    }

    // MongoDB CastError (Invalid ObjectId)
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 404);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        err = new ErrorHandler(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please login again';
        err = new ErrorHandler(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired. Please login again';
        err = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default ErrorHandler;
