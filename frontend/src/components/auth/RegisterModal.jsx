// src/components/auth/RegisterModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal';
import apiService from '../../services/ApiService.js';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [files, setFiles] = useState({
        avatar: null,
        coverImage: null
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        if (fileList && fileList[0]) {
            const file = fileList[0];
            setFiles(prev => ({ ...prev, [name]: file }));
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            if (name === 'avatar') setPreviewAvatar(previewUrl);
            if (name === 'coverImage') setPreviewCover(previewUrl);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!files.avatar) {
            newErrors.avatar = 'Profile picture is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const registrationData = {
            fullname: formData.fullname,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            avatar: files.avatar,
            coverImage: files.coverImage
        };

        const result = await apiService.register(registrationData);
        if (!result.error) {
            onClose();
            setFormData({
                fullname: '',
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            });
            setFiles({ avatar: null, coverImage: null });
            setPreviewAvatar(null);
            setPreviewCover(null);
        } else {
            setErrors({ submit: result.error });
        }
        setIsLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Join Loop Premium">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                                placeholder="Enter your full name"
                            />
                        </div>
                        {errors.fullname && (
                            <p className="text-amber-400 text-xs mt-1">{errors.fullname}</p>
                        )}
                    </div>

                    {/* Email */}
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

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                                placeholder="Choose a username"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-amber-400 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
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
                                placeholder="Create a password"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-amber-400 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                                placeholder="Confirm your password"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-amber-400 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                {/* Avatar Upload */}
                <div>
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            {previewAvatar ? (
                                <img src={previewAvatar} alt="Avatar preview" className="w-16 h-16 rounded-xl object-cover border border-emerald-900/30" />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-emerald-900/30 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                            />
                            {errors.avatar && (
                                <p className="text-amber-400 text-xs mt-1">{errors.avatar}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Cover Image (Optional)
                    </label>
                    <div className="flex flex-col">
                        {previewCover ? (
                            <img src={previewCover} alt="Cover preview" className="w-full h-32 object-cover rounded-xl mb-2 border border-emerald-900/30" />
                        ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-emerald-900/30 flex items-center justify-center mb-2">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-emerald-900/30 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm"
                        />
                    </div>
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
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center">
                    <span className="text-sm text-emerald-400/80">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-amber-300 hover:text-amber-200 font-medium"
                        >
                            Sign in
                        </button>
                    </span>
                </div>
            </form>
        </Modal>
    );
};

export default RegisterModal;