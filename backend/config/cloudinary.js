import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary for file uploads
 * Used for storing resumes and company logos
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export default cloudinary;
