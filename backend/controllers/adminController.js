import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import ErrorHandler from '../middleware/errorHandler.js';

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard-stats
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalEmployers = await User.countDocuments({ role: 'employer' });
        const pendingEmployers = await User.countDocuments({
            role: 'employer',
            isApproved: false,
        });

        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({
            status: 'Pending',
        });

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    employers: totalEmployers,
                    pendingEmployers,
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users with filters
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, isApproved, isBlocked } = req.query;

        const query = {};
        if (role) query.role = role;
        if (isApproved !== undefined) query.isApproved = isApproved === 'true';
        if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';

        const users = await User.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user details with profile
 * GET /api/admin/users/:id
 */
export const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        let profile = null;
        if (user.role === 'student') {
            profile = await StudentProfile.findOne({ user: user._id });
        } else if (user.role === 'employer') {
            profile = await EmployerProfile.findOne({ user: user._id });
        }

        res.status(200).json({
            success: true,
            user,
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Approve employer account
 * PUT /api/admin/approve-employer/:id
 */
export const approveEmployer = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (user.role !== 'employer') {
            return next(new ErrorHandler('User is not an employer', 400));
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Employer approved successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Block/Unblock user
 * PUT /api/admin/block-user/:id
 */
export const blockUser = async (req, res, next) => {
    try {
        const { isBlocked } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (user.role === 'admin') {
            return next(new ErrorHandler('Cannot block admin user', 400));
        }

        user.isBlocked = isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (user.role === 'admin') {
            return next(new ErrorHandler('Cannot delete admin user', 400));
        }

        // Delete associated profile
        if (user.role === 'student') {
            await StudentProfile.findOneAndDelete({ user: user._id });
            await Application.deleteMany({ student: user._id });
        } else if (user.role === 'employer') {
            await EmployerProfile.findOneAndDelete({ user: user._id });
            await Job.deleteMany({ postedBy: user._id });
            await Application.deleteMany({ employer: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all jobs
 * GET /api/admin/jobs
 */
export const getAllJobs = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) query.status = status;

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
 * Delete job
 * DELETE /api/admin/jobs/:id
 */
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new ErrorHandler('Job not found', 404));
        }

        // Delete associated applications
        await Application.deleteMany({ job: job._id });

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
 * Get all applications
 * GET /api/admin/applications
 */
export const getAllApplications = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('student', 'email')
            .populate('job', 'title companyName')
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
