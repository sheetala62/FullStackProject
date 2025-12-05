import mongoose from 'mongoose';

/**
 * Application Model
 * Tracks job applications and their status
 */
const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        studentProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        coverLetter: {
            type: String,
            maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        statusUpdatedAt: {
            type: Date,
        },
        employerNotes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

// Update statusUpdatedAt when status changes
applicationSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusUpdatedAt = new Date();
    }
    next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
