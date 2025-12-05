import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    createProfile,
    updateProfile,
    uploadResume,
    getMyProfile,
    getAllJobs,
    getJobDetails,
    applyJob,
    getMyApplications,
    saveJob,
    removeSavedJob,
    getSavedJobs,
} from '../controllers/studentController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
});

// All routes require student role
router.use(isAuthenticated, authorizeRoles('student'));

// Profile routes
router.post('/profile', createProfile);
router.put('/profile', updateProfile);
router.get('/my-profile', getMyProfile);
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Job routes
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobDetails);

// Application routes
router.post('/apply/:jobId', applyJob);
router.get('/my-applications', getMyApplications);

// Saved jobs routes
router.post('/save-job/:jobId', saveJob);
router.delete('/save-job/:jobId', removeSavedJob);
router.get('/saved-jobs', getSavedJobs);

export default router;
