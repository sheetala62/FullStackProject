import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobTemplate from './models/JobTemplate.js';

dotenv.config();

// Real part-time job templates
const realPartTimeJobs = [
    {
        title: 'Social Media Content Creator - 1 Hour/Day',
        description: 'Create and post engaging content on Instagram, Facebook, and Twitter. Perfect for students who are active on social media. Work from anywhere, anytime!',
        category: 'Marketing',
        jobType: 'Remote',
        workingHours: '1 Hour/Day',
        suggestedSalary: { min: 3000, max: 6000, period: 'monthly' },
        requirements: ['Active on social media', 'Basic phone/computer', 'Creative mindset'],
        responsibilities: ['Post daily content', 'Engage with followers', 'Create simple graphics using Canva'],
        skills: ['Social Media', 'Content Creation', 'Canva'],
    },
    {
        title: 'Online Tutor - 2 Hours/Day (Evening)',
        description: 'Teach school students (Class 6-10) in subjects you excel at. Flexible evening slots. Help students while earning!',
        category: 'Education',
        jobType: 'Remote',
        workingHours: 'Evening',
        suggestedSalary: { min: 200, max: 500, period: 'hourly' },
        requirements: ['Strong subject knowledge', 'Good communication', 'Patience with students'],
        responsibilities: ['Conduct 1-on-1 online classes', 'Explain concepts clearly', 'Assign homework'],
        skills: ['Teaching', 'Subject Knowledge', 'Communication'],
    },
    {
        title: 'Data Entry Operator - Weekend Only',
        description: 'Simple Excel data entry work on Saturdays and Sundays. No experience needed, training provided. Perfect weekend income!',
        category: 'Data Entry',
        jobType: 'Remote',
        workingHours: 'Weekends',
        suggestedSalary: { min: 150, max: 300, period: 'daily' },
        requirements: ['Basic Excel knowledge', 'Computer with internet', 'Good typing speed'],
        responsibilities: ['Enter data into spreadsheets', 'Verify accuracy', 'Submit completed work'],
        skills: ['Excel', 'Data Entry', 'Typing'],
    },
    {
        title: 'Food Delivery Partner - Flexible Hours',
        description: 'Deliver food orders in your area using your bike/scooter. Work whenever you want. Earn per delivery + tips!',
        category: 'Delivery',
        jobType: 'Onsite',
        workingHours: 'Flexible',
        suggestedSalary: { min: 30, max: 60, period: 'hourly' },
        requirements: ['Own bike/scooter', 'Valid license', 'Smartphone', 'Know local area'],
        responsibilities: ['Pick up food from restaurants', 'Deliver to customers', 'Maintain delivery time'],
        skills: ['Driving', 'Time Management', 'Customer Service'],
    },
    {
        title: 'Content Writer - 2 Hours/Day',
        description: 'Write blog posts, articles, and website content. Work from home at your convenience. Great for students who love writing!',
        category: 'Writing',
        jobType: 'Remote',
        workingHours: '2 Hours/Day',
        suggestedSalary: { min: 5000, max: 10000, period: 'monthly' },
        requirements: ['Good English writing', 'Basic computer skills', 'Meet deadlines'],
        responsibilities: ['Write 2-3 articles per week', 'Research topics', 'Proofread content'],
        skills: ['Content Writing', 'English', 'Research'],
    },
    {
        title: 'Customer Support Chat Agent - 3-4 Hours/Day',
        description: 'Answer customer queries via chat/WhatsApp. Flexible timing, work from home. Training provided!',
        category: 'Customer Service',
        jobType: 'Remote',
        workingHours: '3-4 Hours/Day',
        suggestedSalary: { min: 6000, max: 10000, period: 'monthly' },
        requirements: ['Good communication', 'Basic computer', 'Problem-solving skills'],
        responsibilities: ['Respond to customer queries', 'Resolve issues', 'Maintain chat records'],
        skills: ['Communication', 'Customer Service', 'Problem Solving'],
    },
    {
        title: 'Graphic Designer - Project Based (Flexible)',
        description: 'Design social media posts, banners, and flyers. Work on projects as per your schedule. Portfolio building opportunity!',
        category: 'Design',
        jobType: 'Remote',
        workingHours: 'Flexible',
        suggestedSalary: { min: 500, max: 2000, period: 'weekly' },
        requirements: ['Canva or Photoshop skills', 'Creative portfolio', 'Meet deadlines'],
        responsibilities: ['Design social media graphics', 'Create promotional materials', 'Follow brand guidelines'],
        skills: ['Graphic Design', 'Canva', 'Photoshop'],
    },
    {
        title: 'Video Editor - 5-6 Hours/Week',
        description: 'Edit short videos for YouTube, Instagram Reels, and TikTok. Work on your own schedule. Perfect for creative students!',
        category: 'Design',
        jobType: 'Remote',
        workingHours: 'Flexible',
        suggestedSalary: { min: 1000, max: 3000, period: 'weekly' },
        requirements: ['Video editing software knowledge', 'Creative skills', 'Portfolio'],
        responsibilities: ['Edit raw footage', 'Add effects and music', 'Export in required formats'],
        skills: ['Video Editing', 'Premiere Pro', 'After Effects'],
    },
    {
        title: 'Survey Taker / Online Research - 1 Hour/Day',
        description: 'Complete online surveys and research tasks. Easiest part-time work! No skills needed, just honesty and internet.',
        category: 'Other',
        jobType: 'Remote',
        workingHours: '1 Hour/Day',
        suggestedSalary: { min: 2000, max: 4000, period: 'monthly' },
        requirements: ['Smartphone or computer', 'Internet connection', 'Honest responses'],
        responsibilities: ['Complete daily surveys', 'Provide genuine feedback', 'Meet daily targets'],
        skills: ['Basic Internet', 'Attention to Detail'],
    },
    {
        title: 'Retail Store Assistant - Weekend (4 Hours)',
        description: 'Help customers in retail stores on weekends. Great for students who enjoy interacting with people!',
        category: 'Retail',
        jobType: 'Onsite',
        workingHours: 'Weekends',
        suggestedSalary: { min: 200, max: 400, period: 'daily' },
        requirements: ['Good communication', 'Presentable appearance', 'Customer-friendly attitude'],
        responsibilities: ['Assist customers', 'Arrange products', 'Handle billing'],
        skills: ['Customer Service', 'Communication', 'Sales'],
    },
    {
        title: 'Transcription Typist - Flexible Hours',
        description: 'Convert audio/video files to text. Work anytime, anywhere. Perfect for fast typists!',
        category: 'Data Entry',
        jobType: 'Remote',
        workingHours: 'Flexible',
        suggestedSalary: { min: 150, max: 300, period: 'hourly' },
        requirements: ['Fast typing speed (40+ WPM)', 'Good listening skills', 'Headphones'],
        responsibilities: ['Listen to audio files', 'Type accurately', 'Proofread transcripts'],
        skills: ['Typing', 'Listening', 'Attention to Detail'],
    },
    {
        title: 'Language Translator - Project Based',
        description: 'Translate documents between English and regional languages. Work on projects as available. Great for bilingual students!',
        category: 'Writing',
        jobType: 'Remote',
        workingHours: 'Flexible',
        suggestedSalary: { min: 300, max: 600, period: 'daily' },
        requirements: ['Fluent in 2+ languages', 'Good writing skills', 'Cultural understanding'],
        responsibilities: ['Translate documents', 'Maintain context and tone', 'Proofread translations'],
        skills: ['Translation', 'Language Skills', 'Writing'],
    },
    {
        title: 'Virtual Assistant - 2 Hours/Day',
        description: 'Help with emails, scheduling, and basic admin tasks. Learn professional skills while earning!',
        category: 'Other',
        jobType: 'Remote',
        workingHours: '2 Hours/Day',
        suggestedSalary: { min: 5000, max: 8000, period: 'monthly' },
        requirements: ['Good organizational skills', 'Basic MS Office', 'Professional communication'],
        responsibilities: ['Manage emails', 'Schedule appointments', 'Organize files'],
        skills: ['Organization', 'MS Office', 'Communication'],
    },
    {
        title: 'Photography Assistant - Weekend Projects',
        description: 'Assist photographers at events and shoots on weekends. Learn photography while earning!',
        category: 'Design',
        jobType: 'Onsite',
        workingHours: 'Weekends',
        suggestedSalary: { min: 500, max: 1500, period: 'daily' },
        requirements: ['Interest in photography', 'Own camera (preferred)', 'Available on weekends'],
        responsibilities: ['Assist with equipment', 'Help with lighting', 'Organize photos'],
        skills: ['Photography', 'Creativity', 'Teamwork'],
    },
    {
        title: 'App/Website Tester - 1-2 Hours/Day',
        description: 'Test apps and websites, report bugs. No coding needed! Just use apps and give feedback.',
        category: 'Technology',
        jobType: 'Remote',
        workingHours: 'Flexible',
        suggestedSalary: { min: 3000, max: 6000, period: 'monthly' },
        requirements: ['Smartphone/computer', 'Good observation skills', 'Detail-oriented'],
        responsibilities: ['Test apps/websites', 'Report bugs and issues', 'Provide user feedback'],
        skills: ['Testing', 'Attention to Detail', 'Communication'],
    },
];

const seedJobTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing templates (optional)
        await JobTemplate.deleteMany({});

        // Create job templates
        await JobTemplate.insertMany(realPartTimeJobs);

        console.log(`✅ Successfully created ${realPartTimeJobs.length} real part-time job templates!`);
        console.log('\n📋 Job Templates Created:');
        realPartTimeJobs.forEach((job, index) => {
            console.log(`${index + 1}. ${job.title}`);
        });
        console.log('\n🎉 Employers can now activate these jobs from their dashboard!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedJobTemplates();
