// src/components/auth/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

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

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;