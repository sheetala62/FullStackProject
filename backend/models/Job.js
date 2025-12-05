import mongoose from 'mongoose';

/**
 * Job Model
 * Contains job posting details and requirements
 */
const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide job title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide job description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please select job category'],
            enum: [
                'Technology',
                'Marketing',
                'Sales',
                'Customer Service',
                'Education',
                'Healthcare',
                'Hospitality',
                'Retail',
                'Finance',
                'Design',
                'Writing',
                'Delivery',
                'Data Entry',
                'Other',
            ],
        },
        jobType: {
            type: String,
            required: [true, 'Please specify job type'],
            enum: ['Remote', 'Onsite', 'Hybrid'],
            default: 'Onsite',
        },
        workingHours: {
            type: String,
            required: [true, 'Please specify working hours'],
            enum: ['1 Hour/Day', '2 Hours/Day', '3-4 Hours/Day', 'Flexible', 'Weekends', 'Evening'],
            default: 'Flexible',
        },
        location: {
            city: {
                type: String,
                required: [true, 'Please provide city'],
            },
            state: String,
            country: { type: String, default: 'India' },
        },
        salary: {
            min: {
                type: Number,
                required: [true, 'Please provide minimum salary'],
            },
            max: {
                type: Number,
                required: [true, 'Please provide maximum salary'],
            },
            currency: { type: String, default: 'INR' },
            period: {
                type: String,
                enum: ['hourly', 'weekly', 'monthly'],
                default: 'monthly',
            },
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        responsibilities: [
            {
                type: String,
                trim: true,
            },
        ],
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        vacancies: {
            type: Number,
            required: [true, 'Please specify number of vacancies'],
            min: 1,
            default: 1,
        },
        applicationDeadline: {
            type: Date,
            required: [true, 'Please provide application deadline'],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'closed'],
            default: 'active',
        },
        applicationsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and filtering
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ category: 1, 'location.city': 1, status: 1 });

// Automatically expire jobs after deadline
jobSchema.pre('save', function (next) {
    if (this.applicationDeadline < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
