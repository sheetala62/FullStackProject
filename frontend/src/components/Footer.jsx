import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <FaBriefcase className="text-primary-500 text-2xl" />
                            <span className="text-xl font-bold text-white">
                                Job<span className="text-primary-500">Portal</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Connecting students with part-time job opportunities. Find your perfect job or hire talented students.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm hover:text-primary-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="text-sm hover:text-primary-500 transition-colors">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm hover:text-primary-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm hover:text-primary-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Students */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">For Students</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/register" className="text-sm hover:text-primary-500 transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm hover:text-primary-500 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="text-sm hover:text-primary-500 transition-colors">
                                    Find Jobs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">For Employers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/register" className="text-sm hover:text-primary-500 transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm hover:text-primary-500 transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} JobPortal. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
