import mongoose from 'mongoose';

/**
 * Job Template Model
 * Pre-created job templates that employers can activate
 */
const jobTemplateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
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
            enum: ['Remote', 'Onsite', 'Hybrid'],
            default: 'Remote',
        },
        workingHours: {
            type: String,
            enum: ['1 Hour/Day', '2 Hours/Day', '3-4 Hours/Day', 'Flexible', 'Weekends', 'Evening'],
            default: 'Flexible',
        },
        suggestedSalary: {
            min: Number,
            max: Number,
            currency: { type: String, default: 'INR' },
            period: {
                type: String,
                enum: ['hourly', 'daily', 'weekly', 'monthly'],
                default: 'monthly',
            },
        },
        requirements: [String],
        responsibilities: [String],
        skills: [String],
        isActive: {
            type: Boolean,
            default: true,
        },
        timesActivated: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const JobTemplate = mongoose.model('JobTemplate', jobTemplateSchema);

export default JobTemplate;
