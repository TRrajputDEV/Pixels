// src/components/auth/AuthGuard.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-emerald-800 rounded-full animate-spin"></div>
                    <p className="mt-4 text-emerald-300">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
                    <div className="text-center max-w-md px-4">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-amber-300 rounded-full border-dashed animate-spin-slow"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-300 mb-4">
                            Premium Content Access
                        </h2>
                        <p className="text-emerald-400/80 mb-6">
                            Sign in to access exclusive content and features
                        </p>
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-700/30"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

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
    }

    return children;
};

export default AuthGuard;