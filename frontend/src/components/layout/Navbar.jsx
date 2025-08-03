// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleAuthAction = (action) => {
        if (action === 'login') {
            setShowLoginModal(true);
        } else if (action === 'register') {
            setShowRegisterModal(true);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2"
                            >
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">▶</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">StreamTube</span>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search videos..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right side - Auth or User Menu */}
                        <div className="flex items-center space-x-4">
                            {!isAuthenticated ? (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleAuthAction('login')}
                                        className="px-4 py-2 text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => handleAuthAction('register')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Upload Button */}
                                    <button
                                        onClick={() => navigate('/upload')}
                                        className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                        title="Upload Video"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>

                                    {/* User Avatar */}
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2"
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.fullname}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 text-sm font-medium">
                                                    {user?.fullname?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <button
                                                onClick={() => navigate('/dashboard')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Your Channel
                                            </button>
                                            <hr className="my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                }}
            />
        </>
    );
};

export default Navbar;
