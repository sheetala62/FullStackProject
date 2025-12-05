import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import JobTemplate from '../models/JobTemplate.js';
import ErrorHandler from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Create employer profile
 * POST /api/employer/profile
 */
export const createProfile = async (req, res, next) => {
    try {
        const existingProfile = await EmployerProfile.findOne({ user: req.user._id });
        if (existingProfile) {
            return next(new ErrorHandler('Profile already exists. Use update instead', 400));
        }

        const profileData = {
            user: req.user._id,
            ...req.body,
        };

        const profile = await EmployerProfile.create(profileData);

        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update employer profile
 * PUT /api/employer/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        let profile = await EmployerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return next(new ErrorHandler('Profile not found. Create profile first', 404));
        }

        profile = await EmployerProfile.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my employer profile
 * GET /api/employer/my-profile
 */
export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await EmployerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(200).json({
                success: true,
                profile: null,
                message: 'Profile not created yet',
            });
        }

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Post a new job
 * POST /api/employer/jobs
 */
export const postJob = async (req, res, next) => {
    try {
        // Check if employer profile exists
        const employerProfile = await EmployerProfile.findOne({ user: req.user._id });
        if (!employerProfile) {
            return next(new ErrorHandler('Please create your profile first', 400));
        }

        const jobData = {
            ...req.body,
            postedBy: req.user._id,
            companyName: employerProfile.companyName,
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            job,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update job
 * PUT /api/employer/jobs/:id
 */
export const updateJob = async (req, res, next) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        // Check if user is the owner
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('Not authorized to update this job', 403));
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete job
 * DELETE /api/employer/jobs/:id
 */
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        // Check if user is the owner
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('Not authorized to delete this job', 403));
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my posted jobs
 * GET /api/employer/my-jobs
 */
export const getMyJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get applicants for a specific job
 * GET /api/employer/jobs/:jobId/applicants
 */
export const getJobApplicants = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        // Check if job exists and belongs to employer
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('Not authorized to view applicants', 403));
        }

        const applicants = await Application.find({ job: jobId })
            .populate('student', 'email')
            .populate('studentProfile')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applicants.length,
            applicants,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update application status (Approve/Reject)
 * PUT /api/employer/applications/:applicationId
 */
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status, employerNotes } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return next(new ErrorHandler('Invalid status', 400));
        }

        const application = await Application.findById(applicationId).populate('job');

        if (!application) {
            return next(new ErrorHandler('Application not found', 404));
        }

        // Check if employer owns the job
        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('Not authorized', 403));
        }

        application.status = status;
        if (employerNotes) {
            application.employerNotes = employerNotes;
        }
        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status.toLowerCase()} successfully`,
            application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get dashboard statistics
 * GET /api/employer/dashboard-stats
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalJobs = await Job.countDocuments({ postedBy: req.user._id });
        const activeJobs = await Job.countDocuments({
            postedBy: req.user._id,
            status: 'active',
        });

        const totalApplications = await Application.countDocuments({
            employer: req.user._id,
        });
        const pendingApplications = await Application.countDocuments({
            employer: req.user._id,
            status: 'Pending',
        });

        res.status(200).json({
            success: true,
            stats: {
                totalJobs,
                activeJobs,
                totalApplications,
                pendingApplications,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Browse available job templates
 * GET /api/employer/job-templates
 */
export const getJobTemplates = async (req, res, next) => {
    try {
        const { category, workingHours, jobType, search } = req.query;

        const query = { isActive: true };

        if (category) query.category = category;
        if (workingHours) query.workingHours = workingHours;
        if (jobType) query.jobType = jobType;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const templates = await JobTemplate.find(query).sort({ timesActivated: -1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            templates,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Activate a job template (create actual job from template)
 * POST /api/employer/activate-job/:templateId
 */
export const activateJobTemplate = async (req, res, next) => {
    try {
        const { templateId } = req.params;
        const { location, salary, vacancies, applicationDeadline } = req.body;

        // Check if employer profile exists
        const employerProfile = await EmployerProfile.findOne({ user: req.user._id });
        if (!employerProfile) {
            return next(new ErrorHandler('Please create your profile first', 400));
        }

        // Get the template
        const template = await JobTemplate.findById(templateId);
        if (!template) {
            return next(new ErrorHandler('Job template not found', 404));
        }

        // Create actual job from template
        const jobData = {
            title: template.title,
            description: template.description,
            category: template.category,
            jobType: template.jobType,
            workingHours: template.workingHours,
            location: location || { city: 'Not specified', country: 'India' },
            salary: salary || template.suggestedSalary,
            requirements: template.requirements,
            responsibilities: template.responsibilities,
            skills: template.skills,
            vacancies: vacancies || 1,
            applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            postedBy: req.user._id,
            companyName: employerProfile.companyName,
        };

        const job = await Job.create(jobData);

        // Increment template activation count
        template.timesActivated += 1;
        await template.save();

        res.status(201).json({
            success: true,
            message: 'Job activated successfully',
            job,
        });
    } catch (error) {
        next(error);
    }
};
