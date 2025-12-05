import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { COMPANY_SIZES, INDIAN_STATES } from '../../utils/constants';

const EmployerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        phone: '',
        companyDescription: '',
        website: '',
        industry: '',
        companySize: '',
        establishedYear: '',
        address: { city: '', state: '', zipCode: '' },
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/employer/my-profile');
            if (data.profile) {
                setProfile(data.profile);
                setFormData({ ...data.profile, address: data.profile.address || {} });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
            const method = profile ? 'put' : 'post';
            const { data } = await axios[method]('/employer/profile', formData);
            if (data.success) {
                toast.success(data.message);
                fetchProfile();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Company Profile</h1>
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="input-field" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" pattern="[0-9]{10}" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description *</label>
                            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} required rows="4" className="input-field" maxLength="1000" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                                <input type="text" name="industry" value={formData.industry} onChange={handleChange} required className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                                <select name="companySize" value={formData.companySize} onChange={handleChange} className="input-field">
                                    <option value="">Select</option>
                                    {COMPANY_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                                <input type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange} className="input-field" min="1900" max={new Date().getFullYear()} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full">Save Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
