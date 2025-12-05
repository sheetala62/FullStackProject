import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Register function
    const register = async (email, password, role) => {
        try {
            const { data } = await axios.post('/auth/register', {
                email,
                password,
                role,
            });

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                toast.success(data.message);
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                toast.success(data.message);
                return { success: true, user: data.user };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local storage even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user;
    };

    // Check user role
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
        hasRole,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
