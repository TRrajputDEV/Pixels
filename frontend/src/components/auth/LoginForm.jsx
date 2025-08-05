// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, AlertCircle, ArrowLeft, Film } from "lucide-react"

const LoginForm = () => {
    const [formData, setFormData] = useState({
        loginField: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.loginField.trim()) newErrors.loginField = 'Email or username is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const isEmail = formData.loginField.includes('@');
        const loginData = {
            password: formData.password,
            ...(isEmail ? { email: formData.loginField } : { username: formData.loginField })
        };

        const result = await login(loginData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setErrors({ submit: result.error });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo/Brand */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <Film className="h-8 w-8 text-primary" />
                            <span className="doto-font-heading font-extrabold">Pixels</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Sign in to your account
                    </p>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="loginField">Email or Username</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="loginField"
                                        name="loginField"
                                        type="text"
                                        placeholder="Enter your email or username"
                                        className="pl-10"
                                        value={formData.loginField}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.loginField && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.loginField}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {errors.submit && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errors.submit}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm"
                                    disabled={isLoading}
                                >
                                    Forgot your password?
                                </Button>
                            </div>

                            <Separator />

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Button
                                    type="button"
                                    variant="link"
                                    className="p-0 h-auto font-medium"
                                    onClick={() => navigate('/register')}
                                    disabled={isLoading}
                                >
                                    Create account
                                </Button>
                            </div>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={() => navigate('/')}
                                    className="text-muted-foreground"
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="mr-1 h-3 w-3" />
                                    Back to Home
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;