import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getUserDetails,
    approveEmployer,
    blockUser,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllApplications,
} from '../controllers/adminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(isAuthenticated, authorizeRoles('admin'));

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/approve-employer/:id', approveEmployer);
router.put('/block-user/:id', blockUser);
router.delete('/users/:id', deleteUser);

// Job management
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

// Application management
router.get('/applications', getAllApplications);

export default router;
