// src/components/auth/RegisterModal.jsx
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Mail, Lock, Check, AlertCircle, Camera, Image as ImageIcon } from "lucide-react"
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
            handleClose();
        } else {
            setErrors({ submit: result.error });
        }
        setIsLoading(false);
    };

    const handleClose = () => {
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
        setErrors({});
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Join Pixels</DialogTitle>
                    <DialogDescription>
                        Create your account to start sharing and watching videos
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Upload */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={previewAvatar} alt="Profile preview" />
                                <AvatarFallback className="text-lg">
                                    {formData.fullname ? formData.fullname[0]?.toUpperCase() : <User className="h-8 w-8" />}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar"
                                className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                            >
                                <Camera className="h-3 w-3" />
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    {errors.avatar && (
                        <p className="text-sm text-destructive text-center">{errors.avatar}</p>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="pl-10"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.fullname && (
                                <p className="text-sm text-destructive">{errors.fullname}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        className="pl-10"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-sm text-destructive">{errors.username}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Check className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        className="pl-10"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                            {previewCover ? (
                                <div className="relative">
                                    <img 
                                        src={previewCover} 
                                        alt="Cover preview" 
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <label
                                        htmlFor="coverImage"
                                        className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-md cursor-pointer transition-colors"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </label>
                                </div>
                            ) : (
                                <label
                                    htmlFor="coverImage"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload cover image
                                        </p>
                                    </div>
                                </label>
                            )}
                            <input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
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
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-primary hover:underline font-medium"
                            disabled={isLoading}
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;