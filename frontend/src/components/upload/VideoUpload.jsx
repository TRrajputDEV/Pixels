// src/components/upload/VideoUpload.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    Upload,
    Video,
    Image,
    CheckCircle,
    AlertCircle,
    Loader2,
    Film,
    Clock,
    FileVideo,
    ImageIcon
} from "lucide-react"
import videoService from "@/services/VideoService"

const VideoUpload = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    })

    // File state
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)

    // UI state
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null)
    const [errors, setErrors] = useState({})

    // Preview URLs
    const [videoPreview, setVideoPreview] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [videoDuration, setVideoDuration] = useState(null)

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

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate video file
            if (!file.type.startsWith('video/')) {
                setErrors(prev => ({
                    ...prev,
                    video: "Please select a valid video file"
                }))
                return
            }

            // Check file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    video: "Video file must be smaller than 100MB"
                }))
                return
            }

            setVideoFile(file)
            const url = URL.createObjectURL(file)
            setVideoPreview(url)

            // Extract duration
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                setVideoDuration(video.duration)
                URL.revokeObjectURL(video.src)
            }
            video.src = url

            // Clear error
            setErrors(prev => ({
                ...prev,
                video: ""
            }))
        }
    }

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate image file
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: "Please select a valid image file"
                }))
                return
            }

            // Check file size (max 5MB for images)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    thumbnail: "Image file must be smaller than 5MB"
                }))
                return
            }

            setThumbnailFile(file)
            setThumbnailPreview(URL.createObjectURL(file))

            // Clear error
            setErrors(prev => ({
                ...prev,
                thumbnail: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        }

        if (!videoFile) {
            newErrors.video = "Video file is required"
        }

        if (!thumbnailFile) {
            newErrors.thumbnail = "Thumbnail is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Update only the handleSubmit function:

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsUploading(true)
        setUploadProgress(0)
        setUploadStatus(null)

        try {
            // Pass raw data to VideoService - let it handle FormData creation
            const videoData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                videoFile: videoFile,      // File object
                thumbnail: thumbnailFile   // File object
            }

            

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + Math.random() * 15
                })
            }, 800)

            // Upload using VideoService
            const result = await videoService.uploadVideo(videoData)

            clearInterval(progressInterval)
            setUploadProgress(100)

            if (result.success) {
                setUploadStatus('success')
                setTimeout(() => {
                    navigate(`/watch/${result.data._id}`)
                }, 2000)
            } else {
                throw new Error(result.error || 'Upload failed')
            }

        } catch (error) {
            console.error('Upload error:', error)
            setUploadStatus('error')
            setErrors({ submit: error.message })
            setUploadProgress(0)
        } finally {
            setIsUploading(false)
        }
    }


    const resetForm = () => {
        setFormData({ title: "", description: "" })
        setVideoFile(null)
        setThumbnailFile(null)
        setVideoPreview(null)
        setThumbnailPreview(null)
        setVideoDuration(null)
        setErrors({})
        setUploadProgress(0)
        setUploadStatus(null)
    }

    return (
        <div className="min-h-screen bg-background pt-20 pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Film className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold doto-font-heading">Upload Video</h1>
                            <p className="text-muted-foreground">
                                Share your content with the Pixels community
                            </p>
                        </div>
                    </div>
                    <Separator />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Video Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileVideo className="h-5 w-5" />
                                    Video File
                                </CardTitle>
                                <CardDescription>
                                    Upload your video file (Max 100MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="video-upload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${videoPreview
                                            ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                                            : 'border-border bg-muted/30 hover:bg-muted/50'
                                            }`}>
                                            {videoPreview ? (
                                                <div className="flex flex-col items-center gap-3 text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-8 w-8" />
                                                    <div className="text-center">
                                                        <p className="font-medium">{videoFile?.name}</p>
                                                        <p className="text-sm">
                                                            {videoDuration && `Duration: ${formatDuration(videoDuration)}`}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(videoFile?.size / (1024 * 1024)).toFixed(1)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <p className="font-medium">Upload Video</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            MP4, AVI, MOV, WMV supported
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Maximum file size: 100MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                id="video-upload"
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    {errors.video && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.video}</AlertDescription>
                                        </Alert>
                                    )}

                                    {videoPreview && (
                                        <video
                                            src={videoPreview}
                                            controls
                                            className="w-full rounded-lg max-h-48 bg-black"
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thumbnail Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Thumbnail
                                </CardTitle>
                                <CardDescription>
                                    Choose an eye-catching thumbnail image
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="thumbnail-upload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${thumbnailPreview
                                            ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                                            : 'border-border bg-muted/30 hover:bg-muted/50'
                                            }`}>
                                            {thumbnailPreview ? (
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Image className="h-10 w-10 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <p className="font-medium">Upload Thumbnail</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            JPG, PNG, WebP supported
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Maximum file size: 5MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                id="thumbnail-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    {errors.thumbnail && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.thumbnail}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Video Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Details</CardTitle>
                            <CardDescription>
                                Add title and description to help viewers find your content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Enter an engaging title for your video..."
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="doto-font"
                                    disabled={isUploading}
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
                                    placeholder="Tell viewers about your video. What's it about? What makes it special?"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="doto-font resize-none"
                                    disabled={isUploading}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {formData.description.length}/1000 characters
                                </p>
                            </div>

                            {videoDuration && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Duration: {formatDuration(videoDuration)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upload Progress */}
                    {isUploading && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Uploading your video...</span>
                                        <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                    <p className="text-xs text-muted-foreground text-center">
                                        Please don't close this window while uploading
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Status Messages */}
                    {uploadStatus === 'success' && (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Video uploaded successfully! Redirecting to watch page...
                            </AlertDescription>
                        </Alert>
                    )}

                    {uploadStatus === 'error' && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {errors.submit || "Upload failed. Please try again."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isUploading}
                            className="doto-font-button"
                        >
                            Cancel
                        </Button>

                        {uploadStatus !== 'success' && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={resetForm}
                                disabled={isUploading}
                                className="doto-font-button"
                            >
                                Reset
                            </Button>
                        )}

                        <Button
                            type="submit"
                            disabled={isUploading || !videoFile || !thumbnailFile}
                            className="doto-font-button"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Video
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VideoUpload
