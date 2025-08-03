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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Sign in required
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please sign in to access this content.
                        </p>
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
