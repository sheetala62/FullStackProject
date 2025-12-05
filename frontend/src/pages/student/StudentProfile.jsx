// ...existing code...
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { INDIAN_STATES } from '../../utils/constants';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    address: { city: '', state: '', zipCode: '' },
    education: { institution: '', degree: '', fieldOfStudy: '', graduationYear: '', currentYear: '' },
    skills: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/student/my-profile');
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          fullName: data.profile.fullName || '',
          phone: data.profile.phone || '',
          dateOfBirth: data.profile.dateOfBirth?.split('T')[0] || '',
          bio: data.profile.bio || '',
          address: data.profile.address || { city: '', state: '', zipCode: '' },
          education: data.profile.education || {},
          skills: data.profile.skills?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const method = profile ? 'put' : 'post';
      const endpoint = '/student/profile';

      const { data } = await axios[method](endpoint, payload);

      if (data.success) {
        toast.success(data.message);
        fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a file');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('resume', resumeFile);

    try {
      const { data } = await axios.post('/student/upload-resume', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success('Resume uploaded successfully');
        fetchProfile();
        setResumeFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Resume Upload */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resume</h2>
          {profile?.resume?.url && (
            <div className="mb-4">
              <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                View Current Resume
              </a>
            </div>
          )}
          <form onSubmit={handleResumeUpload} className="flex gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">Upload</button>
          </form>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" pattern="[0-9]{10}" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="input-field" maxLength="500"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select name="address.state" value={formData.address.state} onChange={handleChange} className="input-field">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input type="text" name="education.institution" value={formData.education.institution} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input type="text" name="education.degree" value={formData.education.degree} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input type="text" name="education.fieldOfStudy" value={formData.education.fieldOfStudy} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
                  <input type="text" name="education.currentYear" value={formData.education.currentYear} onChange={handleChange} className="input-field" placeholder="e.g., 2nd Year" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, Python" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
// ...existing code...