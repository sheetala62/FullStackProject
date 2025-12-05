import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const { data } = await axios.get('/student/saved-jobs');
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (jobId) => {
        try {
            const { data } = await axios.delete(`/student/save-job/${jobId}`);
            if (data.success) {
                toast.success('Job removed from saved list');
                fetchSavedJobs();
            }
        } catch (error) {
            toast.error('Failed to remove job');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Saved Jobs</h1>
                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} onSave={handleRemove} isSaved={true} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No saved jobs</p>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
