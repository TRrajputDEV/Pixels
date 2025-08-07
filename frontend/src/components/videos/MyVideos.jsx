// src/components/videos/MyVideos.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Video,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ThumbsUp,
    MessageSquare,
    ArrowLeft,
    Upload,
    Filter,
    Loader2,
    AlertCircle,
    Play,
    Calendar,
    Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dashboardService from "@/services/DashboardService"
import videoService from "@/services/VideoService"
import ConfirmDialog from "@/components/ui/ConfirmDialog"

const MyVideos = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [error, setError] = useState(null)

    // Filters
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortType, setSortType] = useState('desc')
    const [statusFilter, setStatusFilter] = useState('all')

    // Dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [videoToDelete, setVideoToDelete] = useState(null)

    // Fetch videos
    useEffect(() => {
        fetchVideos()
    }, [sortBy, sortType, statusFilter])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await dashboardService.getChannelVideos({
                page: 1,
                limit: 50,
                sortBy,
                sortType,
                status: statusFilter
            })

            if (result.success) {
                setVideos(result.data.videos || [])
            } else {
                setError(result.error || "Failed to load videos")
            }
        } catch (err) {
            setError("An error occurred while loading videos")
            console.error("Videos fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (video) => {
        setVideoToDelete(video)
        setShowDeleteDialog(true)
    }

    const handleDeleteConfirm = async () => {
        if (!videoToDelete) return

        try {
            setDeleting(videoToDelete._id)
            const result = await videoService.deleteVideo(videoToDelete._id)

            if (result.success) {
                // Remove video from list
                setVideos(prev => prev.filter(v => v._id !== videoToDelete._id))

                // Show success toast
                toast({
                    title: "Video Deleted! 🗑️",
                    description: `"${videoToDelete.title}" has been permanently deleted.`,
                    duration: 4000,
                })
            } else {
                toast({
                    title: "Delete Failed",
                    description: result.error || "Failed to delete video",
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
            setDeleting(null)
            setShowDeleteDialog(false)
            setVideoToDelete(null)
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

    if (error) {
        return (
            <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold doto-font-heading">My Videos</h1>
                            <p className="text-muted-foreground">
                                Manage your uploaded videos and content
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/upload')}
                            className="doto-font-button"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Video
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Filters:</span>
                        </div>
                        <div className="flex gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Videos</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="unpublished">Drafts</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">Upload Date</SelectItem>
                                    <SelectItem value="view">Views</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="engagementScore">Engagement</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortType} onValueChange={setSortType}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest</SelectItem>
                                    <SelectItem value="asc">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Videos List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="w-32 h-20 bg-muted rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                            <div className="h-3 bg-muted rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div className="space-y-4">
                        {videos.map((video) => (
                            <Card key={video._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Video Thumbnail */}
                                        <div className="relative w-32 h-20 rounded overflow-hidden bg-muted flex-shrink-0 group cursor-pointer"
                                            onClick={() => navigate(`/watch/${video._id}`)}>
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                                {formatDuration(video.duration)}
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg line-clamp-2 doto-font hover:text-primary cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/watch/${video._id}`)}>
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {video.description}
                                                    </p>
                                                </div>

                                                {/* Actions Menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            disabled={deleting === video._id}
                                                        >
                                                            {deleting === video._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/watch/${video._id}`)}
                                                        >
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Watch
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/edit-video/${video._id}`)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(video)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Video Stats */}
                                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {formatNumber(video.view)} views
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    {formatNumber(video.likeCount || 0)} likes
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    {formatNumber(video.commentCount || 0)} comments
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatTimeAgo(video.createdAt)}
                                                </div>
                                                <Badge variant={video.isPublished ? "default" : "secondary"}>
                                                    {video.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                        <p className="text-muted-foreground mb-4">
                            {statusFilter === 'published'
                                ? "You haven't published any videos yet"
                                : statusFilter === 'unpublished'
                                    ? "No draft videos found"
                                    : "You haven't uploaded any videos yet"
                            }
                        </p>
                        <Button
                            onClick={() => navigate('/upload')}
                            className="doto-font-button"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Your First Video
                        </Button>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false)
                        setVideoToDelete(null)
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Video?"
                    description={
                        videoToDelete
                            ? `Are you sure you want to delete "${videoToDelete.title}"? This action cannot be undone and will permanently remove the video, along with all its comments and likes.`
                            : "This action cannot be undone."
                    }
                    confirmText="Delete Video"
                    cancelText="Keep Video"
                />
            </div>
        </div>
    )
}

export default MyVideos
