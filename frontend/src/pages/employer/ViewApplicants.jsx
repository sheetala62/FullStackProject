import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaTools, FaFileAlt, FaFilter, FaStar, FaRegStar } from 'react-icons/fa';

const ViewApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobDetails, setJobDetails] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchSkill, setSearchSkill] = useState('');
    const [shortlistedIds, setShortlistedIds] = useState(new Set());

    useEffect(() => {
        fetchApplicants();
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        filterApplicants();
    }, [applicants, filterStatus, searchSkill]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await axios.get(`/employer/jobs/${jobId}`);
            if (data.success) {
                setJobDetails(data.job);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchApplicants = async () => {
        try {
            const { data } = await axios.get(`/employer/jobs/${jobId}/applicants`);
            if (data.success) {
                setApplicants(data.applicants);
                setFilteredApplicants(data.applicants);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const filterApplicants = () => {
        let filtered = [...applicants];

        // Filter by status
        if (filterStatus !== 'all') {
            if (filterStatus === 'shortlisted') {
                filtered = filtered.filter(app => shortlistedIds.has(app._id));
            } else {
                filtered = filtered.filter(app => app.status.toLowerCase() === filterStatus.toLowerCase());
            }
        }

        // Filter by skill
        if (searchSkill.trim()) {
            filtered = filtered.filter(app => {
                const skills = app.studentProfile?.skills || [];
                return skills.some(skill =>
                    skill.toLowerCase().includes(searchSkill.toLowerCase())
                );
            });
        }

        setFilteredApplicants(filtered);
    };

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            const { data } = await axios.put(`/employer/applications/${applicationId}`, { status });
            if (data.success) {
                toast.success(`Application ${status.toLowerCase()} successfully`);
                fetchApplicants();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const toggleShortlist = (applicationId) => {
        const newShortlisted = new Set(shortlistedIds);
        if (newShortlisted.has(applicationId)) {
            newShortlisted.delete(applicationId);
            toast.info('Removed from shortlist');
        } else {
            newShortlisted.add(applicationId);
            toast.success('Added to shortlist');
        }
        setShortlistedIds(newShortlisted);
    };

    const getSkillMatchPercentage = (studentSkills, jobSkills) => {
        if (!studentSkills || !jobSkills || jobSkills.length === 0) return 0;

        const matchedSkills = studentSkills.filter(skill =>
            jobSkills.some(jobSkill =>
                jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(jobSkill.toLowerCase())
            )
        );

        return Math.round((matchedSkills.length / jobSkills.length) * 100);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Job Applicants</h1>
                    {jobDetails && (
                        <p className="text-gray-600 mt-2">
                            {jobDetails.title} - {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
                        </p>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FaFilter className="text-primary-600" />
                        <h2 className="text-lg font-semibold">Filter Applicants</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field"
                            >
                                <option value="all">All Applicants</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="shortlisted">Shortlisted ({shortlistedIds.size})</option>
                            </select>
                        </div>

                        {/* Skill Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Skill</label>
                            <input
                                type="text"
                                placeholder="e.g., React, Python, Design..."
                                value={searchSkill}
                                onChange={(e) => setSearchSkill(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg">
                                <span className="font-semibold">{filteredApplicants.length}</span> applicants found
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants List */}
                {filteredApplicants.length > 0 ? (
                    <div className="space-y-6">
                        {filteredApplicants.map(app => {
                            const skillMatch = getSkillMatchPercentage(
                                app.studentProfile?.skills || [],
                                jobDetails?.skills || []
                            );
                            const isShortlisted = shortlistedIds.has(app._id);

                            return (
                                <div key={app._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                    {/* Header with Name and Actions */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    {app.studentProfile?.fullName || 'N/A'}
                                                </h3>
                                                <button
                                                    onClick={() => toggleShortlist(app._id)}
                                                    className={`p-2 rounded-full transition-colors ${isShortlisted
                                                            ? 'text-yellow-500 hover:text-yellow-600'
                                                            : 'text-gray-400 hover:text-yellow-500'
                                                        }`}
                                                    title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                                                >
                                                    {isShortlisted ? <FaStar size={24} /> : <FaRegStar size={24} />}
                                                </button>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-primary-600" />
                                                    <span>{app.student?.email}</span>
                                                </div>
                                                {app.studentProfile?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone className="text-primary-600" />
                                                        <span>{app.studentProfile.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Skill Match Indicator */}
                                    {jobDetails?.skills && jobDetails.skills.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Skill Match</span>
                                                <span className={`text-sm font-bold ${skillMatch >= 70 ? 'text-green-600' :
                                                        skillMatch >= 40 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {skillMatch}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${skillMatch >= 70 ? 'bg-green-500' :
                                                            skillMatch >= 40 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}
                                                    style={{ width: `${skillMatch}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            {/* Education */}
                                            {app.studentProfile?.education && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaGraduationCap className="text-primary-600" />
                                                        <h4 className="font-semibold text-gray-800">Education</h4>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium">{app.studentProfile.education.degree}</p>
                                                        <p className="text-sm text-gray-600">{app.studentProfile.education.fieldOfStudy}</p>
                                                        <p className="text-sm text-gray-600">{app.studentProfile.education.institution}</p>
                                                        {app.studentProfile.education.currentYear && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Current Year: {app.studentProfile.education.currentYear}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Skills */}
                                            {app.studentProfile?.skills && app.studentProfile.skills.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaTools className="text-primary-600" />
                                                        <h4 className="font-semibold text-gray-800">Skills</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.studentProfile.skills.map((skill, idx) => {
                                                            const isMatched = jobDetails?.skills?.some(jobSkill =>
                                                                jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                                                skill.toLowerCase().includes(jobSkill.toLowerCase())
                                                            );
                                                            return (
                                                                <span
                                                                    key={idx}
                                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${isMatched
                                                                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                        }`}
                                                                >
                                                                    {skill}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            {/* Cover Letter */}
                                            {app.coverLetter && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaFileAlt className="text-primary-600" />
                                                        <h4 className="font-semibold text-gray-800">Cover Letter</h4>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-gray-700 text-sm whitespace-pre-line">
                                                            {app.coverLetter}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bio */}
                                            {app.studentProfile?.bio && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-2">About</h4>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-gray-700 text-sm">{app.studentProfile.bio}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Resume */}
                                            {app.studentProfile?.resume?.url && (
                                                <a
                                                    href={`http://localhost:4000${app.studentProfile.resume.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                                >
                                                    <FaFileAlt />
                                                    View Resume
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {app.status === 'Pending' && (
                                        <div className="flex gap-3 mt-6 pt-6 border-t">
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                            >
                                                ✓ Approve Application
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                            >
                                                ✗ Reject Application
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applicants Found</h3>
                        <p className="text-gray-600">
                            {searchSkill || filterStatus !== 'all'
                                ? 'Try adjusting your filters to see more applicants.'
                                : 'No one has applied for this job yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewApplicants;
