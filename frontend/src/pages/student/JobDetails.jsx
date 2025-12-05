import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            console.log('🔍 Fetching job details for ID:', id);
            const { data } = await axios.get(`/jobs/${id}`);
            console.log('✅ Job details received:', data);
            if (data.success) {
                setJob(data.job);
            }
        } catch (error) {
            console.error('❌ Error fetching job details:', error);
            console.error('❌ Error response:', error.response?.data);
            toast.error('Job not found');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            toast.info('Please login as a student to apply for jobs');
            navigate('/login');
            return;
        }

        // Check if user is a student
        if (user?.role !== 'student') {
            toast.warning('Only students can apply for jobs');
            return;
        }

        setShowApplyModal(true);
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            const { data } = await axios.post(`/student/apply/${id}`, { coverLetter });
            if (data.success) {
                toast.success('Application submitted successfully');
                setShowApplyModal(false);
                navigate('/student/applications');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Loader />;
    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                        <p className="text-xl text-gray-600">{job.companyName}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="badge-info">{job.category}</span>
                        <span className="badge bg-purple-100 text-purple-800">{job.jobType}</span>
                        <span className="badge bg-orange-100 text-orange-800">{job.workingHours}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center text-gray-700">
                            <FaMapMarkerAlt className="mr-3 text-primary-600" />
                            <span>{job.location.city}, {job.location.state || job.location.country}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <FaMoneyBillWave className="mr-3 text-primary-600" />
                            <span>₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}/{job.salary.period}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <FaBriefcase className="mr-3 text-primary-600" />
                            <span>{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <FaClock className="mr-3 text-primary-600" />
                            <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Job Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Responsibilities</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {job.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)}
                            </ul>
                        </div>
                    )}

                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Requirements</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                            </ul>
                        </div>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="badge bg-gray-100 text-gray-800">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={handleApplyClick} className="btn-primary w-full">
                        Apply Now
                    </button>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Write a cover letter (optional)"
                            rows="6"
                            className="input-field mb-4"
                        />
                        <div className="flex gap-4">
                            <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                            <button onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
