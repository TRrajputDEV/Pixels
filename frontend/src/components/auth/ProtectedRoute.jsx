// src/components/auth/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Film } from "lucide-react"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <Film className="h-8 w-8 text-primary animate-pulse" />
                        <span className="doto-font-heading font-extrabold">Pixels</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Authenticating...</span>
                    </div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;