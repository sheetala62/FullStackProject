import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import ErrorHandler from '../middleware/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * Register a new user (Student or Employer)
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return next(new ErrorHandler('Please provide all required fields', 400));
        }

        // Check if role is valid
        if (!['student', 'employer'].includes(role)) {
            return next(new ErrorHandler('Invalid role', 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler('Email already registered', 400));
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role,
        });

        // Send token
        sendToken(user, 201, res, 'Registration successful');
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return next(new ErrorHandler('Please provide email and password', 400));
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Check password
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return next(new ErrorHandler('Your account has been blocked', 403));
        }

        // Send token
        sendToken(user, 200, res, 'Login successful');
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 * GET /api/auth/logout
 */
export const logout = async (req, res, next) => {
    try {
        res
            .status(200)
            .cookie('token', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .json({
                success: true,
                message: 'Logged out successfully',
            });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        let profile = null;

        // Get role-specific profile
        if (user.role === 'student') {
            profile = await StudentProfile.findOne({ user: user._id });
        } else if (user.role === 'employer') {
            profile = await EmployerProfile.findOne({ user: user._id });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
            },
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Forgot Password - Send OTP
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new ErrorHandler('Please provide email', 400));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler('User not found with this email', 404));
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to user (expires in 10 minutes)
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP via email
        const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Job Portal account.</p>
      <p>Your OTP is: <strong style="font-size: 24px; color: #4F46E5;">${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - Job Portal',
                message,
            });

            res.status(200).json({
                success: true,
                message: `OTP sent to ${email}`,
            });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save();

            return next(new ErrorHandler('Email could not be sent', 500));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Password with OTP
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return next(new ErrorHandler('Please provide all required fields', 400));
        }

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpire: { $gt: Date.now() },
        }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid or expired OTP', 400));
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        next(error);
    }
};
