import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get('/student/my-applications');
            if (data.success) {
                setApplications(data.applications);
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
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Applications</h1>
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">{app.job?.title}</h3>
                                        <p className="text-gray-600">{app.job?.companyName}</p>
                                        <p className="text-sm text-gray-500 mt-2">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`badge-${app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No applications yet</p>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
