import express from 'express';
import {
    createProfile,
    updateProfile,
    getMyProfile,
    postJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getJobApplicants,
    updateApplicationStatus,
    getDashboardStats,
    getJobTemplates,
    activateJobTemplate,
} from '../controllers/employerController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require employer role
router.use(isAuthenticated, authorizeRoles('employer'));

// Profile routes
router.post('/profile', createProfile);
router.put('/profile', updateProfile);
router.get('/my-profile', getMyProfile);

// Job routes
router.post('/jobs', postJob);
router.get('/jobs/:id', async (req, res, next) => {
    try {
        const Job = (await import('../models/Job.js')).default;
        const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        next(error);
    }
});
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/my-jobs', getMyJobs);

// Applicant routes
router.get('/jobs/:jobId/applicants', getJobApplicants);
router.put('/applications/:applicationId', updateApplicationStatus);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Job Template routes (NEW)
router.get('/job-templates', getJobTemplates);
router.post('/activate-job/:templateId', activateJobTemplate);

export default router;
