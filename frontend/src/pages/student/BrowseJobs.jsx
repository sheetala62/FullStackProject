import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';
import { JOB_CATEGORIES, JOB_TYPES } from '../../utils/constants';
import { toast } from 'react-toastify';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const BrowseJobs = () => {
    const { isAuthenticated, user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: '',
        jobType: '',
    });
    const [tempFilters, setTempFilters] = useState({
        search: '',
        category: '',
        location: '',
        jobType: '',
    });

    // Fetch jobs on component mount and when filters change
    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            console.log('🔍 Fetching jobs with params:', params.toString());
            console.log('🔍 Full URL:', `/jobs?${params.toString()}`);

            const { data } = await axios.get(`/jobs?${params.toString()}`);

            console.log('✅ API Response:', data);
            console.log('✅ Jobs count:', data.jobs?.length);

            if (data.success) {
                setJobs(data.jobs);
                console.log('✅ Jobs set in state:', data.jobs.length);
            }
        } catch (error) {
            console.error('❌ Error fetching jobs:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            toast.error('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTempFilterChange = (e) => {
        setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(tempFilters);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            search: '',
            category: '',
            location: '',
            jobType: '',
        };
        setTempFilters(emptyFilters);
        setFilters(emptyFilters);
    };

    const handleSaveJob = async (jobId) => {
        // Check if user is authenticated and is a student
        if (!isAuthenticated()) {
            toast.info('Please login as a student to save jobs');
            return;
        }

        if (user?.role !== 'student') {
            toast.warning('Only students can save jobs');
            return;
        }

        try {
            const { data } = await axios.post(`/student/save-job/${jobId}`);
            if (data.success) {
                toast.success('Job saved successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save job');
        }
    };

    const hasActiveFilters = Object.values(tempFilters).some(val => val !== '');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Browse Part-Time Jobs</h1>
                    <p className="text-gray-600 mt-2">Find flexible 1-2 hour daily jobs perfect for students</p>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search jobs..."
                            value={tempFilters.search}
                            onChange={handleTempFilterChange}
                            className="input-field"
                        />
                        <select
                            name="category"
                            value={tempFilters.category}
                            onChange={handleTempFilterChange}
                            className="input-field"
                        >
                            <option value="">All Categories</option>
                            {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input
                            type="text"
                            name="location"
                            placeholder="City (e.g., Mumbai)"
                            value={tempFilters.location}
                            onChange={handleTempFilterChange}
                            className="input-field"
                        />
                        <select
                            name="jobType"
                            value={tempFilters.jobType}
                            onChange={handleTempFilterChange}
                            className="input-field"
                        >
                            <option value="">All Types</option>
                            {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <FaSearch />
                            Search Jobs
                        </button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <FaTimes />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </form>

                {/* Results Count */}
                {!loading && (
                    <div className="mb-4">
                        <p className="text-gray-600">
                            {jobs.length > 0
                                ? `Found ${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}`
                                : 'No jobs found'
                            }
                        </p>
                    </div>
                )}

                {/* Jobs Grid */}
                {loading ? (
                    <Loader />
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} onSave={handleSaveJob} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">😔</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
                        <p className="text-gray-600 mb-6">
                            {hasActiveFilters
                                ? 'Try adjusting your filters or clearing them to see all available jobs.'
                                : 'No part-time jobs are currently available. Check back soon!'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="btn-primary"
                            >
                                View All Jobs
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseJobs;
