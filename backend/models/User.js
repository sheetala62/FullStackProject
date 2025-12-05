import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Model - Base model for all user types
 * Roles: student, employer, admin
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['student', 'employer', 'admin'],
            required: [true, 'Please specify user role'],
        },
        isApproved: {
            type: Boolean,
            default: function () {
                // Auto-approve students and admins, employers need manual approval
                return this.role === 'student' || this.role === 'admin';
            },
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        resetPasswordOTP: String,
        resetPasswordOTPExpire: Date,
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

const User = mongoose.model('User', userSchema);

export default User;
