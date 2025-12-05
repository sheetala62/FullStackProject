import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { FaUsers, FaBriefcase, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/admin/dashboard-stats');
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
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaUsers className="text-3xl text-primary-600 mb-2" />
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-3xl font-bold">{stats.users?.total || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaBriefcase className="text-3xl text-green-600 mb-2" />
                        <p className="text-sm text-gray-600">Total Jobs</p>
                        <p className="text-3xl font-bold">{stats.jobs?.total || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaFileAlt className="text-3xl text-blue-600 mb-2" />
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-3xl font-bold">{stats.applications?.total || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <FaCheckCircle className="text-3xl text-yellow-600 mb-2" />
                        <p className="text-sm text-gray-600">Pending Employers</p>
                        <p className="text-3xl font-bold">{stats.users?.pendingEmployers || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
                        <div className="space-y-2">
                            <p className="flex justify-between"><span>Students:</span> <span className="font-semibold">{stats.users?.students || 0}</span></p>
                            <p className="flex justify-between"><span>Employers:</span> <span className="font-semibold">{stats.users?.employers || 0}</span></p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Job Statistics</h2>
                        <div className="space-y-2">
                            <p className="flex justify-between"><span>Active Jobs:</span> <span className="font-semibold">{stats.jobs?.active || 0}</span></p>
                            <p className="flex justify-between"><span>Pending Applications:</span> <span className="font-semibold">{stats.applications?.pending || 0}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
