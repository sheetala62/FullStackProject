import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">About JobPortal</h1>

                    <div className="prose max-w-none">
                        <p className="text-lg text-gray-600 mb-4">
                            Welcome to JobPortal, your premier destination for connecting students with part-time job opportunities.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-4">
                            We are dedicated to bridging the gap between talented students seeking part-time work and employers
                            looking for skilled, motivated individuals. Our platform makes it easy for students to find flexible
                            job opportunities that fit their schedules while helping employers discover fresh talent.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Why Choose Us?</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Curated part-time job listings specifically for students</li>
                            <li>Easy-to-use platform with advanced search and filtering</li>
                            <li>Direct communication between students and employers</li>
                            <li>Secure and verified employer accounts</li>
                            <li>Resume management and application tracking</li>
                            <li>Mobile-friendly design for job searching on the go</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">For Students</h2>
                        <p className="text-gray-600 mb-4">
                            Create your profile, upload your resume, and start applying to part-time jobs that match your
                            skills and availability. Track your applications and get notified when employers review your profile.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">For Employers</h2>
                        <p className="text-gray-600 mb-4">
                            Post your job openings, review applications from qualified students, and manage your hiring process
                            all in one place. Our platform helps you find the right talent quickly and efficiently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
