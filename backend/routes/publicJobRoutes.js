import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

/**
 * Get all active jobs (PUBLIC - no authentication required)
 * GET /api/jobs
 */
router.get('/', async (req, res, next) => {
    try {
        const { search, category, location, jobType, workingHours } = req.query;

        const query = { status: 'active' };

        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by location (city)
        if (location) {
            query['location.city'] = { $regex: location, $options: 'i' };
        }

        // Filter by job type
        if (jobType) {
            query.jobType = jobType;
        }

        // Filter by working hours
        if (workingHours) {
            query.workingHours = workingHours;
        }

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .select('-applicationsCount');

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get single job details (PUBLIC)
 * GET /api/jobs/:id
 */
router.get('/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
