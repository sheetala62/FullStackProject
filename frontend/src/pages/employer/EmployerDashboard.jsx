import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { FaBriefcase, FaUsers, FaClock } from 'react-icons/fa';

const EmployerDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/employer/dashboard-stats');
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Employer Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaBriefcase className="text-3xl text-primary-600 mb-2" />
                        <p className="text-sm text-gray-600">Total Jobs</p>
                        <p className="text-3xl font-bold">{stats.totalJobs || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaBriefcase className="text-3xl text-green-600 mb-2" />
                        <p className="text-sm text-gray-600">Active Jobs</p>
                        <p className="text-3xl font-bold">{stats.activeJobs || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaUsers className="text-3xl text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-3xl font-bold">{stats.totalApplications || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaClock className="text-3xl text-yellow-600 mb-2" />
                        <p className="text-sm text-gray-600">Pending Applications</p>
                        <p className="text-3xl font-bold">{stats.pendingApplications || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/employer/post-job" className="bg-primary-600 text-white p-6 rounded-xl hover:bg-primary-700">
                        <h3 className="text-xl font-semibold mb-2">Post New Job</h3>
                        <p>Create a new job posting</p>
                    </Link>
                    <Link to="/employer/jobs" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Manage Jobs</h3>
                        <p>View and edit your job postings</p>
                    </Link>
                    <Link to="/employer/profile" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
                        <p>Update company information</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
