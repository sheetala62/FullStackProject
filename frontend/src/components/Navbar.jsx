import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'student':
                return '/student/dashboard';
            case 'employer':
                return '/employer/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/';
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <FaBriefcase className="text-primary-600 text-2xl" />
                        <span className="text-xl font-bold text-gray-800">
                            Job<span className="text-primary-600">Portal</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/jobs"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Browse Jobs
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Contact
                        </Link>

                        {isAuthenticated() ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={getDashboardLink()}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    <FaUser />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-primary-600"
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/jobs"
                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Browse Jobs
                        </Link>
                        <Link
                            to="/about"
                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {isAuthenticated() ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-700 hover:text-primary-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
