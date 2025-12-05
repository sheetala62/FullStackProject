import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            const { data } = await axios.get('/employer/my-jobs');
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
            const { data } = await axios.delete(`/employer/jobs/${id}`);
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
                    <Link to="/employer/post-job" className="btn-primary">Post New Job</Link>
                </div>

                {jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{job.title}</h3>
                                        <p className="text-gray-600 mt-1">{job.category} • {job.jobType}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {job.applicationsCount} applications • Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/employer/jobs/${job._id}/applicants`} className="btn-primary">
                                            View Applicants
                                        </Link>
                                        <button onClick={() => handleDelete(job._id)} className="btn-secondary">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No jobs posted yet</p>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
