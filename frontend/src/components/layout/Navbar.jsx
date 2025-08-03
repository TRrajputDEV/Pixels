// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import Logo from '../ui/Logo';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-900 shadow-lg border-b border-emerald-900/30' 
                    : 'bg-gray-900'
            }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-8">
                            <Logo 
                                onClick={() => navigate('/')}
                                size="default"
                                showText={true}
                                className="transition-transform hover:scale-105"
                            />

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center space-x-1">
                                <NavLink to="/" label="Home" />
                                <NavLink to="/trending" label="Trending" />
                                <NavLink to="/subscriptions" label="Subscriptions" />
                                <NavLink to="/library" label="Library" />
                            </div>
                        </div>

                        {/* Enhanced Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search videos, creators, or topics..."
                                    className="w-full px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-emerald-900/50 text-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-gray-800 transition-all duration-300 shadow-inner-light"
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-amber-300 transition-colors p-1 rounded-lg hover:bg-emerald-900/20">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {!isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleAuthAction('login')}
                                        className="px-5 py-2.5 text-emerald-300 border border-emerald-700/50 rounded-xl hover:bg-emerald-900/30 hover:border-emerald-500 transition-all duration-300 font-medium shadow-inner-light backdrop-blur-sm"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => handleAuthAction('register')}
                                        className="btn-primary"
                                    >
                                        ✨ Get Started
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    {/* Upload Button */}
                                    <button
                                        onClick={() => navigate('/upload')}
                                        className="p-2.5 bg-gray-800 border border-emerald-900/50 rounded-lg hover:bg-emerald-900/30 transition-colors group"
                                        title="Upload Video"
                                    >
                                        <svg className="w-5 h-5 text-emerald-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>

                                    {/* Notifications */}
                                    <button className="relative p-2.5 bg-gray-800 border border-emerald-900/50 rounded-lg hover:bg-emerald-900/30 transition-colors group">
                                        <svg className="w-5 h-5 text-emerald-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full"></div>
                                    </button>

                                    {/* User Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center p-1.5 bg-gray-800 border border-emerald-900/50 rounded-lg hover:bg-emerald-900/30 transition-colors"
                                        >
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.fullname}
                                                    className="w-8 h-8 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {user?.fullname?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showUserMenu && (
                                            <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-emerald-900/30 rounded-lg shadow-lg py-2 z-50">
                                                <div className="px-4 py-3 border-b border-emerald-900/30">
                                                    <div className="flex items-center space-x-3">
                                                        {user?.avatar ? (
                                                            <img src={user.avatar} alt={user.fullname} className="w-9 h-9 rounded-lg object-cover" />
                                                        ) : (
                                                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
                                                                <span className="text-white font-semibold">{user?.fullname?.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">{user?.fullname}</p>
                                                            <p className="text-emerald-400 text-sm">@{user?.username}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <DropdownItem onClick={() => navigate('/dashboard')} icon="📊" label="Dashboard" />
                                                <DropdownItem onClick={() => navigate('/profile')} icon="👤" label="Your Channel" />
                                                <DropdownItem onClick={() => navigate('/analytics')} icon="📈" label="Analytics" />
                                                <DropdownItem onClick={() => navigate('/settings')} icon="⚙️" label="Settings" />
                                                
                                                <div className="border-t border-emerald-900/30 mt-2 pt-2">
                                                    <DropdownItem onClick={handleLogout} icon="🚪" label="Sign Out" danger />
                                                </div>
                                            </div>
                                        )}
                                    </div>
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

// Navigation Link Component
const NavLink = ({ to, label }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className="px-4 py-2 text-emerald-300 hover:text-white hover:bg-emerald-900/30 rounded-lg transition-colors font-medium"
        >
            {label}
        </button>
    );
};

// Dropdown Item Component
const DropdownItem = ({ onClick, icon, label, danger = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors ${
            danger 
                ? 'text-amber-400 hover:bg-amber-900/10' 
                : 'text-emerald-300 hover:bg-emerald-900/20'
        }`}
    >
        <span>{icon}</span>
        <span>{label}</span>
    </button>
);

export default Navbar;