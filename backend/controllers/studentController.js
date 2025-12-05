import StudentProfile from '../models/StudentProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import ErrorHandler from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Create student profile
 * POST /api/student/profile
 */
export const createProfile = async (req, res, next) => {
    try {
        // Check if profile already exists
        const existingProfile = await StudentProfile.findOne({ user: req.user._id });
        if (existingProfile) {
            return next(new ErrorHandler('Profile already exists. Use update instead', 400));
        }

        const profileData = {
            user: req.user._id,
            ...req.body,
        };

        const profile = await StudentProfile.create(profileData);

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
 * Update student profile
 * PUT /api/student/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        let profile = await StudentProfile.findOne({ user: req.user._id });

        if (!profile) {
            return next(new ErrorHandler('Profile not found. Create profile first', 404));
        }

        profile = await StudentProfile.findOneAndUpdate(
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
 * Upload resume
 * POST /api/student/upload-resume
 */
export const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler('Please upload a file', 400));
        }

        const profile = await StudentProfile.findOne({ user: req.user._id });

        if (!profile) {
            return next(new ErrorHandler('Please create profile first', 404));
        }

        // Delete old resume file if exists
        if (profile.resume && profile.resume.filename) {
            const fs = await import('fs');
            const path = await import('path');
            const oldFilePath = path.join(process.cwd(), 'uploads', 'resumes', profile.resume.filename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Save file info to database
        profile.resume = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: `/uploads/resumes/${req.file.filename}`,
            uploadedAt: new Date(),
        };

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resume: profile.resume,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my profile
 * GET /api/student/my-profile
 */
export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
            'savedJobs'
        );

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
 * Get all active jobs
 * GET /api/student/jobs
 */
export const getAllJobs = async (req, res, next) => {
    try {
        const { category, location, minSalary, maxSalary, jobType, search } = req.query;

        // Build query
        const query = { status: 'active', applicationDeadline: { $gte: new Date() } };

        if (category) query.category = category;
        if (location) query['location.city'] = new RegExp(location, 'i');
        if (minSalary) query['salary.min'] = { $gte: Number(minSalary) };
        if (maxSalary) query['salary.max'] = { $lte: Number(maxSalary) };
        if (jobType) query.jobType = jobType;
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { companyName: new RegExp(search, 'i') },
            ];
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'email')
            .sort({ createdAt: -1 });

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
 * Get job details
 * GET /api/student/jobs/:id
 */
export const getJobDetails = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'email');

        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Apply for a job
 * POST /api/student/apply/:jobId
 */
export const applyJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        // Check if student profile exists
        const studentProfile = await StudentProfile.findOne({ user: req.user._id });
        if (!studentProfile) {
            return next(new ErrorHandler('Please create your profile first', 400));
        }

        // Check if resume is uploaded
        if (!studentProfile.resume || !studentProfile.resume.url) {
            return next(new ErrorHandler('Please upload your resume first', 400));
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        // Check if job is active
        if (job.status !== 'active') {
            return next(new ErrorHandler('This job is no longer active', 400));
        }

        // Check if deadline has passed
        if (new Date() > job.applicationDeadline) {
            return next(new ErrorHandler('Application deadline has passed', 400));
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            student: req.user._id,
        });

        if (existingApplication) {
            return next(new ErrorHandler('You have already applied for this job', 400));
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            student: req.user._id,
            studentProfile: studentProfile._id,
            employer: job.postedBy,
            coverLetter,
        });

        // Update job applications count
        job.applicationsCount += 1;
        await job.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my applications
 * GET /api/student/my-applications
 */
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('job')
            .populate('studentProfile')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Save/bookmark a job
 * POST /api/student/save-job/:jobId
 */
export const saveJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const profile = await StudentProfile.findOne({ user: req.user._id });
        if (!profile) {
            return next(new ErrorHandler('Please create profile first', 404));
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        // Check if already saved
        if (profile.savedJobs.includes(jobId)) {
            return next(new ErrorHandler('Job already saved', 400));
        }

        profile.savedJobs.push(jobId);
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Job saved successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove saved job
 * DELETE /api/student/save-job/:jobId
 */
export const removeSavedJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        const profile = await StudentProfile.findOne({ user: req.user._id });
        if (!profile) {
            return next(new ErrorHandler('Profile not found', 404));
        }

        profile.savedJobs = profile.savedJobs.filter(
            (id) => id.toString() !== jobId
        );
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Job removed from saved list',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get saved jobs
 * GET /api/student/saved-jobs
 */
export const getSavedJobs = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
            'savedJobs'
        );

        if (!profile) {
            return next(new ErrorHandler('Profile not found', 404));
        }

        res.status(200).json({
            success: true,
            count: profile.savedJobs.length,
            jobs: profile.savedJobs,
        });
    } catch (error) {
        next(error);
    }
};
