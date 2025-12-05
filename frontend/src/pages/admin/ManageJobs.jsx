import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('/admin/jobs');
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const { data } = await axios.delete(`/admin/jobs/${id}`);
            if (data.success) {
                toast.success('Job deleted successfully');
                fetchJobs();
            }
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Jobs</h1>

                {jobs.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td className="px-6 py-4">{job.title}</td>
                                        <td className="px-6 py-4">{job.companyName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge-${job.status === 'active' ? 'success' : 'warning'}`}>{job.status}</span>
                                        </td>
                                        <td className="px-6 py-4">{job.applicationsCount}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-700">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No jobs found</p>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
