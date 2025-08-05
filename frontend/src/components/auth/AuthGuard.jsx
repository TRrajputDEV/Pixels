// src/components/auth/AuthGuard.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Film, Shield } from "lucide-react"
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

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

    if (!isAuthenticated) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="w-full max-w-md">
                        <Card className="text-center">
                            <CardHeader className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Shield className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-xl">Authentication Required</CardTitle>
                                    <CardDescription>
                                        Sign in to access exclusive content and features
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={() => setShowLoginModal(true)}
                                    className="w-full"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => setShowRegisterModal(true)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Create Account
                                </Button>
                            </CardContent>
                        </Card>
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