import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { FaSearch, FaBriefcase, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { JOB_CATEGORIES } from '../utils/constants';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ jobs: 0, students: 0, employers: 0 });

    useEffect(() => {
        fetchFeaturedJobs();
    }, []);

    const fetchFeaturedJobs = async () => {
        try {
            const { data } = await axios.get('/jobs?limit=6');
            if (data.success) {
                setFeaturedJobs(data.jobs.slice(0, 6));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Find Your Perfect Part-Time Job
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Connecting students with amazing opportunities
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {!isAuthenticated() ? (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/jobs"
                                        className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white"
                                    >
                                        Browse Jobs
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to={user?.role === 'student' ? '/student/jobs' : user?.role === 'employer' ? '/employer/dashboard' : '/admin/dashboard'}
                                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary-100 p-4 rounded-full">
                                    <FaBriefcase className="text-primary-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
                            <p className="text-gray-600">Active Jobs</p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary-100 p-4 rounded-full">
                                    <FaUsers className="text-primary-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">1000+</h3>
                            <p className="text-gray-600">Students Registered</p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary-100 p-4 rounded-full">
                                    <FaCheckCircle className="text-primary-600 text-3xl" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">200+</h3>
                            <p className="text-gray-600">Companies Hiring</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Featured Part-Time Jobs
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Discover the latest opportunities for students
                        </p>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : featuredJobs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {featuredJobs.map((job) => (
                                    <JobCard key={job._id} job={job} showActions={false} />
                                ))}
                            </div>
                            <div className="text-center">
                                <Link
                                    to="/jobs"
                                    className="btn-primary inline-block"
                                >
                                    View All Jobs
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No jobs available at the moment</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Find jobs in your field of interest
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {JOB_CATEGORIES.slice(0, 8).map((category) => (
                            <Link
                                key={category}
                                to={`/jobs?category=${category}`}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
                            >
                                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                                    {category}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Account</h3>
                            <p className="text-gray-600">
                                Register as a student or employer in minutes
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {isAuthenticated() && user?.role === 'employer' ? 'Post Jobs' : 'Browse & Apply'}
                            </h3>
                            <p className="text-gray-600">
                                {isAuthenticated() && user?.role === 'employer'
                                    ? 'Post your job openings and reach talented students'
                                    : 'Find jobs that match your skills and interests'}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Hired</h3>
                            <p className="text-gray-600">
                                Connect with employers and start your journey
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated() && (
                <section className="py-16 bg-primary-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 text-primary-100">
                            Join thousands of students finding their perfect part-time jobs
                        </p>
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                        >
                            Register Now
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
