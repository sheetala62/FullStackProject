import mongoose from 'mongoose';

/**
 * Student Profile Model
 * Contains student-specific information and resume
 */
const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: [true, 'Please provide your full name'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide phone number'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        dateOfBirth: {
            type: Date,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'India' },
        },
        education: {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            graduationYear: Number,
            currentYear: String, // e.g., "2nd Year", "3rd Year"
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        resume: {
            public_id: String,
            url: String,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        profilePicture: {
            public_id: String,
            url: String,
        },
    },
    {
        timestamps: true,
    }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
