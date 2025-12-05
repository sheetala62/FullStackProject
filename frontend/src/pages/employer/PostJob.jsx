import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { JOB_CATEGORIES, JOB_TYPES, WORKING_HOURS } from '../../utils/constants';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        jobType: 'Onsite',
        workingHours: 'Part-Time',
        location: { city: '', state: '' },
        salary: { min: '', max: '', period: 'monthly' },
        requirements: '',
        responsibilities: '',
        skills: '',
        vacancies: 1,
        applicationDeadline: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(Boolean),
                responsibilities: formData.responsibilities.split('\n').filter(Boolean),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            };

            const { data } = await axios.post('/employer/jobs', payload);
            if (data.success) {
                toast.success('Job posted successfully');
                navigate('/employer/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Post New Job</h1>
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="input-field" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                                    <option value="">Select</option>
                                    {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange} className="input-field">
                                    {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours *</label>
                                <select name="workingHours" value={formData.workingHours} onChange={handleChange} className="input-field">
                                    {WORKING_HOURS.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} required className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <input type="text" name="location.state" value={formData.location.state} onChange={handleChange} className="input-field" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (₹) *</label>
                                <input type="number" name="salary.min" value={formData.salary.min} onChange={handleChange} required className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (₹) *</label>
                                <input type="number" name="salary.max" value={formData.salary.max} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vacancies *</label>
                                <input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} required min="1" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
                                <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
                            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="4" className="input-field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities (one per line)</label>
                            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows="4" className="input-field" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-field" />
                        </div>

                        <button type="submit" className="btn-primary w-full">Post Job</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
