import mongoose from 'mongoose';

/**
 * Employer Profile Model
 * Contains company information and employer details
 */
const employerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        companyName: {
            type: String,
            required: [true, 'Please provide company name'],
            trim: true,
        },
        contactPerson: {
            type: String,
            required: [true, 'Please provide contact person name'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide phone number'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        companyDescription: {
            type: String,
            required: [true, 'Please provide company description'],
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        website: {
            type: String,
            match: [
                /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                'Please provide a valid URL',
            ],
        },
        companyLogo: {
            public_id: String,
            url: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'India' },
        },
        industry: {
            type: String,
            required: [true, 'Please specify industry'],
        },
        companySize: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
        },
        establishedYear: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear(),
        },
    },
    {
        timestamps: true,
    }
);

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

export default EmployerProfile;
