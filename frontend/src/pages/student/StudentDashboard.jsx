import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { FaBriefcase, FaFileAlt, FaBookmark, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        savedJobs: 0,
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileRes, applicationsRes, savedJobsRes] = await Promise.all([
                axios.get('/student/my-profile'),
                axios.get('/student/my-applications'),
                axios.get('/student/saved-jobs'),
            ]);

            if (profileRes.data.success) {
                setProfile(profileRes.data.profile);
            }

            if (applicationsRes.data.success) {
                const apps = applicationsRes.data.applications;
                setRecentApplications(apps.slice(0, 5));
                setStats({
                    totalApplications: apps.length,
                    pendingApplications: apps.filter(a => a.status === 'Pending').length,
                    approvedApplications: apps.filter(a => a.status === 'Approved').length,
                    savedJobs: savedJobsRes.data.count || 0,
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's your overview</p>
                </div>

                {/* Profile Alert */}
                {!profile && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Please complete your profile to start applying for jobs.{' '}
                                    <Link to="/student/profile" className="font-medium underline">
                                        Complete Profile
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalApplications}</p>
                            </div>
                            <div className="bg-primary-100 p-3 rounded-lg">
                                <FaFileAlt className="text-primary-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <FaClock className="text-yellow-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approvedApplications}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaCheckCircle className="text-green-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Saved Jobs</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.savedJobs}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaBookmark className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/student/jobs"
                        className="bg-primary-600 text-white p-6 rounded-xl shadow-md hover:bg-primary-700 transition-colors"
                    >
                        <FaBriefcase className="text-3xl mb-3" />
                        <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
                        <p className="text-primary-100">Find your next opportunity</p>
                    </Link>

                    <Link
                        to="/student/profile"
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200"
                    >
                        <FaFileAlt className="text-3xl text-primary-600 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">My Profile</h3>
                        <p className="text-gray-600">Update your information</p>
                    </Link>

                    <Link
                        to="/student/saved-jobs"
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200"
                    >
                        <FaBookmark className="text-3xl text-primary-600 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Saved Jobs</h3>
                        <p className="text-gray-600">View bookmarked jobs</p>
                    </Link>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Recent Applications</h2>
                        <Link to="/student/applications" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    {recentApplications.length > 0 ? (
                        <div className="space-y-4">
                            {recentApplications.map((application) => (
                                <div key={application._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{application.job?.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{application.job?.companyName}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Applied on {new Date(application.appliedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            {application.status === 'Pending' && (
                                                <span className="badge-warning">Pending</span>
                                            )}
                                            {application.status === 'Approved' && (
                                                <span className="badge-success">Approved</span>
                                            )}
                                            {application.status === 'Rejected' && (
                                                <span className="badge-danger">Rejected</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No applications yet. Start applying to jobs!</p>
                            <Link to="/student/jobs" className="btn-primary mt-4 inline-block">
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
