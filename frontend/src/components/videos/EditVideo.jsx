// src/components/videos/EditVideo.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertCircle,
    Video,
    Image,
    Eye,
    ThumbsUp,
    MessageSquare,
    Calendar,
    Upload,
    Play,
    Edit3,
    FileText,
    Settings,
    BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import videoService from "@/services/VideoService"

const EditVideo = () => {
    const { videoId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
    const [error, setError] = useState(null)

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isPublished: false
    })

    // File upload
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)

    // Validation errors
    const [errors, setErrors] = useState({})

    // Fetch video data
    useEffect(() => {
        const fetchVideo = async () => {
            if (!videoId) {
                setError("Video ID is required")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const result = await videoService.getVideoById(videoId)

                if (result.success) {
                    const videoData = result.data

                    // Check if user owns this video
                    if (videoData.owner._id !== user?._id) {
                        setError("You don't have permission to edit this video")
                        setLoading(false)
                        return
                    }

                    setVideo(videoData)
                    setFormData({
                        title: videoData.title || "",
                        description: videoData.description || "",
                        isPublished: videoData.isPublished || false
                    })
                } else {
                    setError(result.error || "Failed to load video")
                }
            } catch (err) {
                setError("An error occurred while loading the video")
                console.error("Video fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchVideo()
    }, [videoId, user])

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

    const handlePublishToggle = (checked) => {
        setFormData(prev => ({
            ...prev,
            isPublished: checked
        }))
    }

    const handleThumbnailChange = (e) => {
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
                    description: "Thumbnail image must be smaller than 10MB",
                    variant: "destructive",
                })
                return
            }

            setThumbnailFile(file)
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters"
        } else if (formData.title.trim().length > 100) {
            newErrors.title = "Title cannot exceed 100 characters"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        } else if (formData.description.trim().length > 5000) {
            newErrors.description = "Description cannot exceed 5000 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleUpdateVideo = async () => {
        if (!validateForm()) return

        try {
            setSaving(true)
            const result = await videoService.updateVideo(videoId, {
                title: formData.title.trim(),
                description: formData.description.trim()
            })

            if (result.success) {
                setVideo(prev => ({
                    ...prev,
                    ...result.data
                }))

                toast({
                    title: "Video Updated! ✨",
                    description: "Your video details have been saved successfully",
                })
            } else {
                toast({
                    title: "Update Failed",
                    description: result.error || "Failed to update video",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateThumbnail = async () => {
        if (!thumbnailFile) return

        try {
            setUploadingThumbnail(true)
            const result = await videoService.updateVideoThumbnail(videoId, thumbnailFile)

            if (result.success) {
                setVideo(prev => ({
                    ...prev,
                    thumbnail: result.data.thumbnail
                }))
                setThumbnailFile(null)
                setThumbnailPreview(null)

                toast({
                    title: "Thumbnail Updated! 🖼️",
                    description: "Your video thumbnail has been updated",
                })
            } else {
                toast({
                    title: "Thumbnail Update Failed",
                    description: result.error || "Failed to update thumbnail",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update thumbnail",
                variant: "destructive",
            })
        } finally {
            setUploadingThumbnail(false)
        }
    }

    const handleTogglePublish = async () => {
        try {
            const newStatus = !formData.isPublished
            const result = await videoService.togglePublishStatus(videoId)

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    isPublished: newStatus
                }))
                setVideo(prev => ({
                    ...prev,
                    isPublished: newStatus
                }))

                toast({
                    title: newStatus ? "Video Published! 🚀" : "Video Unpublished",
                    description: newStatus
                        ? "Your video is now visible to everyone"
                        : "Your video is now private (draft)",
                })
            } else {
                toast({
                    title: "Publish Toggle Failed",
                    description: result.error || "Failed to update publish status",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update publish status",
                variant: "destructive",
            })
        }
    }

    const formatTimeAgo = (date) => {
        const now = new Date()
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60))

        if (diffInHours < 24) {
            return `${diffInHours}h ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays}d ago`
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num?.toString() || '0'
    }

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading video...</p>
                </div>
            </div>
        )
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || "Video not found"}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold doto-font-heading">Edit Video</h1>
                            <p className="text-muted-foreground">
                                Update your video details and settings
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={video.isPublished ? "default" : "secondary"}>
                                {video.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/watch/${video._id}`)}
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </div>
                    <Separator />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="thumbnail">
                                    <Image className="mr-2 h-4 w-4" />
                                    Thumbnail
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            {/* Video Details Tab */}
                            <TabsContent value="details" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Edit3 className="h-5 w-5" />
                                            Video Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="Enter video title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="doto-font"
                                                disabled={saving}
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-red-500">{errors.title}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {formData.title.length}/100 characters
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description *</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="Tell viewers about your video"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="min-h-[120px] doto-font resize-none"
                                                disabled={saving}
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-500">{errors.description}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {formData.description.length}/5000 characters
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => navigate(-1)}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleUpdateVideo}
                                                disabled={saving}
                                                className="doto-font-button"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
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

                            {/* Thumbnail Tab */}
                            <TabsContent value="thumbnail" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Image className="h-5 w-5" />
                                            Video Thumbnail
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={thumbnailPreview || video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <input
                                                    id="thumbnail-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                    className="hidden"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => document.getElementById('thumbnail-upload').click()}
                                                        disabled={uploadingThumbnail}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Choose New Thumbnail
                                                    </Button>
                                                    {thumbnailFile && (
                                                        <Button
                                                            onClick={handleUpdateThumbnail}
                                                            disabled={uploadingThumbnail}
                                                            className="doto-font-button"
                                                        >
                                                            {uploadingThumbnail ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="mr-2 h-4 w-4" />
                                                                    Save Thumbnail
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Recommended: 1280x720px, JPG or PNG, under 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            Visibility & Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label>Publish Status</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    {formData.isPublished
                                                        ? "Your video is public and visible to everyone"
                                                        : "Your video is private and only visible to you"
                                                    }
                                                </p>
                                            </div>
                                            <Switch
                                                checked={formData.isPublished}
                                                onCheckedChange={handleTogglePublish}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Video Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Duration</p>
                                                    <p className="font-medium">{formatDuration(video.duration)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">File Size</p>
                                                    <p className="font-medium">Video file</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Uploaded</p>
                                                    <p className="font-medium">{formatTimeAgo(video.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Last Modified</p>
                                                    <p className="font-medium">{formatTimeAgo(video.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Video Preview & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Video Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    Video Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/watch/${video._id}`)}
                                    className="w-full doto-font-button"
                                >
                                    <Play className="mr-2 h-4 w-4" />
                                    Watch Video
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Video Analytics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Views</span>
                                        </div>
                                        <span className="font-medium">{formatNumber(video.view)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Likes</span>
                                        </div>
                                        <span className="font-medium">{formatNumber(0)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Comments</span>
                                        </div>
                                        <span className="font-medium">{formatNumber(0)}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Published</span>
                                        </div>
                                        <span className="font-medium">
                                            {video.isPublished ? formatTimeAgo(video.createdAt) : "Not published"}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => navigate('/analytics')}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Detailed Analytics
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditVideo
