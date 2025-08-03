// src/components/auth/LoginModal.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            onClose();
            setFormData({ email: '', username: '', password: '' });
        } else {
            setErrors({ submit: result.error });
        }
        
        setIsLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sign in to StreamTube">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email/Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email or Username
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your email or username"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your password"
                    />
                </div>

                {/* Error Display */}
                {(errors.login || errors.password || errors.submit) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-sm text-red-600">
                            {errors.login || errors.password || errors.submit}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Switch to Register */}
                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            Sign up
                        </button>
                    </span>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;
