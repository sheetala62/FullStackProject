import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const params = filter ? `?role=${filter}` : '';
            const { data } = await axios.get(`/admin/users${params}`);
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const { data } = await axios.put(`/admin/approve-employer/${id}`);
            if (data.success) {
                toast.success('Employer approved');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to approve');
        }
    };

    const handleBlock = async (id, isBlocked) => {
        try {
            const { data } = await axios.put(`/admin/block-user/${id}`, { isBlocked: !isBlocked });
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const { data } = await axios.delete(`/admin/users/${id}`);
            if (data.success) {
                toast.success('User deleted');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

                <div className="mb-6">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field max-w-xs">
                        <option value="">All Users</option>
                        <option value="student">Students</option>
                        <option value="employer">Employers</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="badge-info">{user.role}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.isBlocked ? <span className="badge-danger">Blocked</span> :
                                            !user.isApproved && user.role === 'employer' ? <span className="badge-warning">Pending</span> :
                                                <span className="badge-success">Active</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        {user.role === 'employer' && !user.isApproved && (
                                            <button onClick={() => handleApprove(user._id)} className="text-green-600 hover:text-green-700">Approve</button>
                                        )}
                                        <button onClick={() => handleBlock(user._id, user.isBlocked)} className="text-yellow-600 hover:text-yellow-700">
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
