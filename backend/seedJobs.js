import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import EmployerProfile from './models/EmployerProfile.js';
import Job from './models/Job.js';

dotenv.config();

// Sample part-time jobs data
const sampleJobs = [
    {
        title: 'Content Writer - 2 Hours/Day',
        description: 'Looking for a student to write blog posts and articles. Work from home, flexible timing. Perfect for students who love writing!',
        category: 'Writing',
        jobType: 'Remote',
        workingHours: 'Part-Time',
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        salary: { min: 5000, max: 8000, currency: 'INR', period: 'monthly' },
        requirements: ['Good English writing skills', 'Basic computer knowledge', 'Internet connection'],
        responsibilities: ['Write 2-3 articles per week', 'Research topics', 'Edit and proofread content'],
        skills: ['Content Writing', 'English', 'Research'],
        vacancies: 3,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
        title: 'Social Media Manager - Flexible Hours',
        description: 'Manage Instagram and Facebook pages for a local business. 1-2 hours daily, work from anywhere!',
        category: 'Marketing',
        jobType: 'Remote',
        workingHours: 'Flexible',
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        salary: { min: 6000, max: 10000, currency: 'INR', period: 'monthly' },
        requirements: ['Active on social media', 'Creative mindset', 'Basic design skills (Canva)'],
        responsibilities: ['Post daily content', 'Engage with followers', 'Create simple graphics'],
        skills: ['Social Media', 'Content Creation', 'Canva'],
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Data Entry - Weekend Only',
        description: 'Simple data entry work on weekends. Perfect for students who want to earn extra money on Saturdays and Sundays.',
        category: 'Other',
        jobType: 'Remote',
        workingHours: 'Weekends',
        location: { city: 'Delhi', state: 'Delhi', country: 'India' },
        salary: { min: 4000, max: 6000, currency: 'INR', period: 'monthly' },
        requirements: ['Basic Excel knowledge', 'Good typing speed', 'Attention to detail'],
        responsibilities: ['Enter data into spreadsheets', 'Verify accuracy', 'Submit weekly reports'],
        skills: ['Excel', 'Typing', 'Data Entry'],
        vacancies: 5,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Graphic Designer - Project Based',
        description: 'Create social media posts and banners. Work on your own schedule, 3-4 hours per week.',
        category: 'Design',
        jobType: 'Remote',
        workingHours: 'Flexible',
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        salary: { min: 7000, max: 12000, currency: 'INR', period: 'monthly' },
        requirements: ['Photoshop or Canva skills', 'Creative portfolio', 'Meet deadlines'],
        responsibilities: ['Design social media graphics', 'Create promotional materials', 'Follow brand guidelines'],
        skills: ['Photoshop', 'Canva', 'Graphic Design'],
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Online Tutor - Evening Slots',
        description: 'Teach school students online. Choose your subjects and timing. 1-2 hours in the evening.',
        category: 'Education',
        jobType: 'Remote',
        workingHours: 'Evening',
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
        salary: { min: 8000, max: 15000, currency: 'INR', period: 'monthly' },
        requirements: ['Good knowledge of subject', 'Patient and friendly', 'Stable internet'],
        responsibilities: ['Conduct online classes', 'Prepare study materials', 'Track student progress'],
        skills: ['Teaching', 'Subject Knowledge', 'Communication'],
        vacancies: 4,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Customer Support - Part Time',
        description: 'Answer customer queries via chat. 3-4 hours daily, flexible timing. Training provided!',
        category: 'Customer Service',
        jobType: 'Remote',
        workingHours: 'Part-Time',
        location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
        salary: { min: 6000, max: 9000, currency: 'INR', period: 'monthly' },
        requirements: ['Good communication', 'Basic computer skills', 'Problem-solving ability'],
        responsibilities: ['Respond to customer queries', 'Resolve issues', 'Maintain chat records'],
        skills: ['Communication', 'Customer Service', 'Problem Solving'],
        vacancies: 6,
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Video Editor - Project Based',
        description: 'Edit short videos for YouTube and Instagram. Work on your schedule, 5-6 hours per week.',
        category: 'Design',
        jobType: 'Remote',
        workingHours: 'Flexible',
        location: { city: 'Kolkata', state: 'West Bengal', country: 'India' },
        salary: { min: 8000, max: 14000, currency: 'INR', period: 'monthly' },
        requirements: ['Video editing software knowledge', 'Creative skills', 'Portfolio of work'],
        responsibilities: ['Edit raw footage', 'Add effects and transitions', 'Export in required formats'],
        skills: ['Video Editing', 'Premiere Pro', 'After Effects'],
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    {
        title: 'Research Assistant - 2 Hours Daily',
        description: 'Help with online research and data collection. Perfect for students interested in research work.',
        category: 'Other',
        jobType: 'Remote',
        workingHours: 'Part-Time',
        location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
        salary: { min: 5000, max: 8000, currency: 'INR', period: 'monthly' },
        requirements: ['Good research skills', 'Attention to detail', 'Basic Excel knowledge'],
        responsibilities: ['Conduct online research', 'Collect and organize data', 'Prepare summaries'],
        skills: ['Research', 'Excel', 'Data Analysis'],
        vacancies: 3,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
];

const seedDatabase = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create a sample employer if not exists
        let employer = await User.findOne({ email: 'employer@jobportal.com' });

        if (!employer) {
            console.log('Creating sample employer...');
            employer = await User.create({
                email: 'employer@jobportal.com',
                password: 'employer123',
                role: 'employer',
                isApproved: true,
            });

            await EmployerProfile.create({
                user: employer._id,
                companyName: 'PartTime Jobs Hub',
                contactPerson: 'Hiring Manager',
                phone: '9876543210',
                companyDescription: 'We connect students with flexible part-time opportunities',
                industry: 'Recruitment',
                companySize: '11-50',
            });
            console.log('✅ Sample employer created');
        }

        // Clear existing jobs (optional)
        // await Job.deleteMany({});

        // Create sample jobs
        console.log('Creating sample part-time jobs...');
        for (const jobData of sampleJobs) {
            await Job.create({
                ...jobData,
                postedBy: employer._id,
                companyName: 'PartTime Jobs Hub',
            });
        }

        console.log(`✅ Successfully created ${sampleJobs.length} sample part-time jobs!`);
        console.log('\n📝 Sample Employer Login:');
        console.log('Email: employer@jobportal.com');
        console.log('Password: employer123');
        console.log('\n🎉 You can now browse jobs at http://localhost:5173/jobs');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
