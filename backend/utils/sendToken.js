/**
 * Send JWT token in cookie
 * Used after login and registration
 */
const sendToken = (user, statusCode, res, message) => {
    // Generate JWT token
    const token = user.getJWTToken();

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
    };

    // Remove password from response
    const userResponse = {
        _id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message,
        user: userResponse,
        token,
    });
};

export default sendToken;
