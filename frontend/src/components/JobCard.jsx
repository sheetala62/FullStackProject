import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const JobCard = ({ job, onSave, isSaved = false, showActions = true }) => {
    const formatSalary = () => {
        return `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}/${job.salary.period}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isExpiringSoon = () => {
        const deadline = new Date(job.applicationDeadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
    };

    return (
        <div className="card group hover:border-primary-200 border border-transparent transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                            {job.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 font-medium mt-1">{job.companyName}</p>
                </div>
                {showActions && onSave && (
                    <button
                        onClick={() => onSave(job._id)}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                    </button>
                )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge-info">{job.category}</span>
                <span className="badge bg-purple-100 text-purple-800">{job.jobType}</span>
                <span className="badge bg-orange-100 text-orange-800">{job.workingHours}</span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-primary-600" />
                    <span>
                        {job.location.city}, {job.location.state || job.location.country}
                    </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <FaMoneyBillWave className="mr-2 text-primary-600" />
                    <span>{formatSalary()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <FaBriefcase className="mr-2 text-primary-600" />
                    <span>{job.vacancies} {job.vacancies === 1 ? 'Position' : 'Positions'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2 text-primary-600" />
                    <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                </div>
            </div>

            {isExpiringSoon() && (
                <div className="mb-4">
                    <span className="badge-warning">⏰ Expiring Soon</span>
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xs text-gray-500">
                    Posted {formatDate(job.createdAt)}
                </span>
                <Link
                    to={`/jobs/${job._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
