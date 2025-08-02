// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email && !formData.username) {
            newErrors.login = 'Email or username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        const loginData = {
            password: formData.password,
            ...(formData.email ? { email: formData.email } : { username: formData.username })
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email or Username */}
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                                Email or Username
                            </label>
                            <input
                                id="login"
                                name="login"
                                type="text"
                                value={formData.email || formData.username}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Determine if it's an email or username based on presence of @
                                    if (value.includes('@')) {
                                        setFormData(prev => ({ ...prev, email: value, username: '' }));
                                    } else {
                                        setFormData(prev => ({ ...prev, username: value, email: '' }));
                                    }
                                    // Clear error when user starts typing
                                    if (errors.login) {
                                        setErrors(prev => ({ ...prev, login: '' }));
                                    }
                                }}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email or username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {(errors.login || errors.password || errors.submit) && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="text-sm text-red-600">
                                {errors.login || errors.password || errors.submit}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Sign up
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
