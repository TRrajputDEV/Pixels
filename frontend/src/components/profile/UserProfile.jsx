// src/components/profile/UserProfile.jsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

import {
    User,
    Camera,
    Save,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle,
    Upload,
    Mail,
    FileText
} from "lucide-react"
import apiService from "@/services/ApiService"
import { useToast } from "@/hooks/use-toast"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const UserProfile = () => {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Form state
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        username: ""
    })

    // Add these state variables
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [changingPassword, setChangingPassword] = useState(false)

    // File state
    const [avatarFile, setAvatarFile] = useState(null)
    const [coverImageFile, setCoverImageFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)

    // UI state
    const [loading, setLoading] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const [errors, setErrors] = useState({})

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                email: user.email || "",
                username: user.username || ""
            })
        }
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear errors
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid File",
                    description: "Please select a valid image file",
                    variant: "destructive",
                })
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Avatar image must be smaller than 5MB",
                    variant: "destructive",
                })
                return
            }

            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid File",
                    description: "Please select a valid image file",
                    variant: "destructive",
                })
                return
            }

            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Cover image must be smaller than 10MB",
                    variant: "destructive",
                })
                return
            }

            setCoverImageFile(file)
            setCoverPreview(URL.createObjectURL(file))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required"
        } else if (formData.fullname.trim().length < 2) {
            newErrors.fullname = "Full name must be at least 2 characters"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format"
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
        } else if (formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters"
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdateProfile = async () => {
        if (!validateForm()) return

        try {
            setLoading(true)
            const result = await apiService.updateAccountDetails({
                fullname: formData.fullname.trim(),
                email: formData.email.trim()
            })

            if (result.error) {
                toast({
                    title: "Update Failed",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                // Update user context
                updateUser(result.data)
                toast({
                    title: "Profile Updated",
                    description: "Your profile has been updated successfully",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateAvatar = async () => {
        if (!avatarFile) return

        try {
            setUploadingAvatar(true)
            const result = await apiService.updateAvatar(avatarFile)

            if (result.error) {
                toast({
                    title: "Avatar Update Failed",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                updateUser(result.data)
                setAvatarFile(null)
                setAvatarPreview(null)
                toast({
                    title: "Avatar Updated",
                    description: "Your profile picture has been updated",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update avatar",
                variant: "destructive",
            })
        } finally {
            setUploadingAvatar(false)
        }
    }

    const handleUpdateCoverImage = async () => {
        if (!coverImageFile) return

        try {
            setUploadingCover(true)
            const result = await apiService.updateCoverImage(coverImageFile)

            if (result.error) {
                toast({
                    title: "Cover Image Update Failed",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                updateUser(result.data)
                setCoverImageFile(null)
                setCoverPreview(null)
                toast({
                    title: "Cover Image Updated",
                    description: "Your cover image has been updated",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update cover image",
                variant: "destructive",
            })
        } finally {
            setUploadingCover(false)
        }
    }


    const handlePasswordChange = async () => {
        try {
            setChangingPassword(true);

            // Frontend validation
            if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                toast({
                    title: "Error",
                    description: "All password fields are required",
                    variant: "destructive",
                });
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast({
                    title: "Error",
                    description: "New passwords do not match",
                    variant: "destructive",
                });
                return;
            }

            if (passwordData.newPassword.length < 6) {
                toast({
                    title: "Error",
                    description: "New password must be at least 6 characters long",
                    variant: "destructive",
                });
                return;
            }

            // Call API
            const response = await apiService.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            console.log("Password change response:", response); // Debug log

            if (response.success) {
                // Clear form
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });

                toast({
                    title: "Success",
                    description: "Password changed successfully",
                });
            } else {
                // ✅ Extract the specific error message
                const errorMessage = response.error || response.message || "Failed to change password";

                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Password change error:", error);

            // ✅ Handle network/parsing errors
            toast({
                title: "Error",
                description: "Network error. Please try again.",
                variant: "destructive",
            });
        } finally {
            setChangingPassword(false);
        }
    };


    return (
        // Replace your entire content area with this tabbed interface:
        <div className="space-y-8">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-8">
                    {/* Your existing Cover Image, Profile Picture, and Personal Information cards go here */}
                    {/* Cover Image Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Cover Image
                            </CardTitle>
                            <CardDescription>
                                Choose a cover image for your channel (Recommended: 1920x480px)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative w-full h-32 md:h-48 rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={coverPreview || user?.coverImage || '/placeholder-cover.jpg'}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-cover.jpg'
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <label htmlFor="cover-upload" className="cursor-pointer">
                                        <div className="bg-black/50 text-white p-3 rounded-full">
                                            <Camera className="h-6 w-6" />
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('cover-upload').click()}
                                    disabled={uploadingCover}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose Cover Image
                                </Button>
                                {coverImageFile && (
                                    <Button
                                        onClick={handleUpdateCoverImage}
                                        disabled={uploadingCover}
                                        className="doto-font-button"
                                    >
                                        {uploadingCover ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Cover
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Picture Section - same as before */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Picture
                            </CardTitle>
                            <CardDescription>
                                Upload a profile picture (Recommended: 400x400px)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={avatarPreview || user?.avatar}
                                            alt={user?.fullname}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {user?.fullname?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Camera className="h-6 w-6 text-white" />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => document.getElementById('avatar-upload').click()}
                                            disabled={uploadingAvatar}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Choose Picture
                                        </Button>
                                        {avatarFile && (
                                            <Button
                                                onClick={handleUpdateAvatar}
                                                disabled={uploadingAvatar}
                                                className="doto-font-button"
                                            >
                                                {uploadingAvatar ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save Avatar
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG or WebP. Max file size 5MB.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information - same as before */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal details and account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name *</Label>
                                    <Input
                                        id="fullname"
                                        name="fullname"
                                        placeholder="Enter your full name"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        className="doto-font"
                                        disabled={loading}
                                    />
                                    {errors.fullname && (
                                        <p className="text-sm text-red-500">{errors.fullname}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username *</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="doto-font"
                                        disabled={true}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-500">{errors.username}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Username cannot be changed after registration
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="doto-font"
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="doto-font-button"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-8">
                    {/* Change Password Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your account password for better security
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="oldPassword">Current Password *</Label>
                                    <Input
                                        id="oldPassword"
                                        type="password"
                                        placeholder="Enter your current password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            oldPassword: e.target.value
                                        }))}
                                        className="doto-font"
                                        disabled={changingPassword}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password *</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                        className="doto-font"
                                        disabled={changingPassword}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        className="doto-font"
                                        disabled={changingPassword}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setPasswordData({
                                        oldPassword: "",
                                        newPassword: "",
                                        confirmPassword: ""
                                    })}
                                    disabled={changingPassword}
                                >
                                    Clear
                                </Button>
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={changingPassword}
                                    className="doto-font-button"
                                >
                                    {changingPassword ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Changing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Change Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Security Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Information</CardTitle>
                            <CardDescription>
                                Your account security details and recommendations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="font-medium">Password Protection</p>
                                            <p className="text-sm text-muted-foreground">Your account is protected with a password</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium mb-2">Security Recommendations:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Use a strong password with at least 8 characters</li>
                                        <li>• Include uppercase, lowercase, numbers, and symbols</li>
                                        <li>• Don't reuse passwords from other accounts</li>
                                        <li>• Change your password regularly</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserProfile
