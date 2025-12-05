import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import BrowseJobs from './pages/student/BrowseJobs';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import SavedJobs from './pages/student/SavedJobs';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import ViewApplicants from './pages/employer/ViewApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAllJobs from './pages/admin/ManageJobs';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/jobs" element={<BrowseJobs />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />

                            {/* Student Routes */}
                            <Route
                                path="/student/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <StudentProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/jobs"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <BrowseJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/applications"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <MyApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/saved-jobs"
                                element={
                                    <ProtectedRoute allowedRoles={['student']}>
                                        <SavedJobs />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Employer Routes */}
                            <Route
                                path="/employer/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['employer']}>
                                        <EmployerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employer/profile"
                                element={
                                    <ProtectedRoute allowedRoles={['employer']}>
                                        <EmployerProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employer/post-job"
                                element={
                                    <ProtectedRoute allowedRoles={['employer']}>
                                        <PostJob />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employer/jobs"
                                element={
                                    <ProtectedRoute allowedRoles={['employer']}>
                                        <ManageJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employer/jobs/:jobId/applicants"
                                element={
                                    <ProtectedRoute allowedRoles={['employer']}>
                                        <ViewApplicants />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <ManageUsers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/jobs"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <ManageAllJobs />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
