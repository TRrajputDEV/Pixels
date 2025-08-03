// src/components/auth/LoginModal.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const result = await login({
            email: formData.email,
            password: formData.password
        });
        
        if (result.success) {
            onClose();
            setFormData({ email: '', password: '' });
        } else {
            setErrors({ submit: result.error });
        }
        setIsLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sign in to Loop">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-amber-400 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-amber-400 text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                {errors.submit && (
                    <div className="bg-gradient-to-r from-amber-900/30 to-amber-900/10 border border-amber-700/30 rounded-xl p-3">
                        <div className="text-sm text-amber-300">
                            {errors.submit}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-emerald-700/30"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center">
                    <span className="text-sm text-emerald-400/80">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="text-amber-300 hover:text-amber-200 font-medium"
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