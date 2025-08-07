// src/components/video/WatchVideo.jsx - Complete Updated Version
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ThumbsUp,
    ThumbsDown,
    Share2,
    Flag,
    MoreHorizontal,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    SkipBack,
    SkipForward,
    Loader2,
    AlertCircle,
    Eye,
    Calendar,
    Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import videoService from "@/services/VideoService"
import VideoLikeButton from "@/components/ui/VideoLikeButton"
import CommentSection from "@/components/comments/CommentSection"
import SubscribeButton from "@/components/ui/SubscribeButton"

// Enhanced Video Player Component
const VideoPlayer = ({ videoUrl, thumbnail, onTimeUpdate, onLoadedMetadata }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    const videoRef = useState(null)
    const playerRef = useState(null)
    const controlsTimeoutRef = useState(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedData = () => {
            setIsLoading(false)
            setDuration(video.duration)
            if (onLoadedMetadata) onLoadedMetadata(video.duration)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
            if (onTimeUpdate) onTimeUpdate(video.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
        }

        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('ended', handleEnded)

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('timeupdate', handleTimeUpdate)
            video.removeEventListener('ended', handleEnded)
        }
    }, [videoUrl, onTimeUpdate, onLoadedMetadata])

    // Auto-hide controls
    useEffect(() => {
        if (showControls && isPlaying) {
            clearTimeout(controlsTimeoutRef.current)
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }
        return () => clearTimeout(controlsTimeoutRef.current)
    }, [showControls, isPlaying])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleVolumeChange = (e) => {
        const video = videoRef.current
        if (!video) return

        const newVolume = parseFloat(e.target.value)
        video.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const handleSeek = (e) => {
        const video = videoRef.current
        if (!video) return

        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        const newTime = percent * duration
        video.currentTime = newTime
        setCurrentTime(newTime)
    }

    const skip = (seconds) => {
        const video = videoRef.current
        if (!video) return

        video.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
    }

    const toggleFullscreen = () => {
        const player = playerRef.current
        if (!player) return

        if (!isFullscreen) {
            if (player.requestFullscreen) {
                player.requestFullscreen()
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen()
            } else if (player.msRequestFullscreen) {
                player.msRequestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
            }
        }
        setIsFullscreen(!isFullscreen)
    }

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0

    return (
        <div
            ref={playerRef}
            className="relative w-full bg-black rounded-lg overflow-hidden group"
            style={{ aspectRatio: '16/9' }}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full"
                src={videoUrl}
                poster={thumbnail}
                preload="metadata"
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()} // Disable right-click
                style={{ pointerEvents: 'none' }} // Prevent direct interaction
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            )}

            {/* Click Overlay for Play/Pause */}
            <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
            >
                {!isPlaying && !isLoading && (
                    <div className="bg-black/50 rounded-full p-4 transition-all duration-200 hover:bg-black/70">
                        <Play className="h-12 w-12 text-white fill-current" />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div
                    className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglePlay}
                            className="text-white hover:bg-white/20"
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        {/* Skip buttons */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => skip(-10)}
                            className="text-white hover:bg-white/20"
                        >
                            <SkipBack className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => skip(10)}
                            className="text-white hover:bg-white/20"
                        >
                            <SkipForward className="h-4 w-4" />
                        </Button>

                        {/* Volume */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMute}
                                className="text-white hover:bg-white/20"
                            >
                                {isMuted || volume === 0 ?
                                    <VolumeX className="h-5 w-5" /> :
                                    <Volume2 className="h-5 w-5" />
                                }
                            </Button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>

                        {/* Time Display */}
                        <span className="text-white text-sm font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Fullscreen */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                    >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const WatchVideo = () => {
    const { videoId } = useParams()
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [video, setVideo] = useState(null)
    const [relatedVideos, setRelatedVideos] = useState([]) // This will show ALL videos
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDescription, setShowDescription] = useState(false)

    // Fetch video and related videos
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch current video
                const videoResult = await videoService.getVideoById(videoId)
                if (videoResult.success) {
                    setVideo(videoResult.data)
                } else {
                    setError(videoResult.error || "Video not found")
                    return
                }

                // Fetch ALL videos as related videos (excluding current video)
                const relatedResult = await videoService.getAllVideos({
                    page: 1,
                    limit: 20, // Show 20 related videos
                    sortBy: 'createdAt',
                    sortType: 'desc'
                })

                if (relatedResult.success) {
                    // Filter out current video from related videos
                    const allVideos = relatedResult.data.docs || relatedResult.data || []
                    const filteredVideos = allVideos.filter(v => v._id !== videoId)
                    setRelatedVideos(filteredVideos)
                }

            } catch (err) {
                setError("An error occurred while loading the video")
                console.error("Watch video error:", err)
            } finally {
                setLoading(false)
            }
        }

        if (videoId) {
            fetchVideoData()
        }
    }, [videoId])

    // Handle video time updates (for watch history, analytics, etc.)
    const handleTimeUpdate = (currentTime) => {
        // You can track watch progress here for analytics
        // console.log('Current time:', currentTime)
    }

    const handleVideoMetadata = (duration) => {
        // You can update video duration or analytics here
        // console.log('Video duration:', duration)
    }

    const handleShare = async () => {
        try {
            if (navigator.share) {
                // Use native Web Share API (modern browsers/mobile devices)
                await navigator.share({
                    title: video.title,
                    text: `Check out this amazing video: ${video.title}`,
                    url: window.location.href,
                });

                toast({
                    title: "Thanks for sharing! 🚀",
                    description: "Video shared successfully",
                });
            } else {
                // Fallback: Copy to clipboard (desktop browsers)
                await navigator.clipboard.writeText(window.location.href);

                toast({
                    title: "Link copied! 📋",
                    description: "Video URL copied to clipboard",
                });
            }
        } catch (error) {
            if (error.name !== 'AbortError') { // User cancelled share dialog
                toast({
                    title: "Share failed",
                    description: "Unable to share video. Please copy the URL manually.",
                    variant: "destructive",
                });
                console.error('Share error:', error);
            }
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date()
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60))

        if (diffInHours < 24) {
            return `${diffInHours}h ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            if (diffInDays < 30) {
                return `${diffInDays}d ago`
            } else if (diffInDays < 365) {
                return `${Math.floor(diffInDays / 30)}mo ago`
            } else {
                return `${Math.floor(diffInDays / 365)}y ago`
            }
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
        <div className="min-h-screen bg-background ">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Video Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <VideoPlayer
                            videoUrl={video.videoFile}
                            thumbnail={video.thumbnail}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleVideoMetadata}
                        />

                        {/* Video Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold doto-font-heading mb-2">
                                    {video.title}
                                </h1>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {formatNumber(video.view)} views
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatTimeAgo(video.createdAt)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <VideoLikeButton
                                            videoId={video._id}
                                            initialLikeCount={0}
                                            initialIsLiked={false}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Flag className="h-4 w-4 mr-2" />
                                            Report
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Channel Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={video.owner?.avatar}
                                            alt={video.owner?.fullname}
                                        />
                                        <AvatarFallback>
                                            {video.owner?.fullname?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold doto-font">
                                            {video.owner?.fullname || video.owner?.username}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Content Creator
                                        </p>
                                    </div>
                                </div>
                                <SubscribeButton
                                    channelId={video.owner._id}
                                    channelName={video.owner?.fullname || video.owner?.username}
                                    initialSubscriberCount={0} // You can get this from backend if available
                                    className="doto-font-button"
                                />
                            </div>

                            {/* Description */}
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className={`${showDescription ? '' : 'line-clamp-3'}`}>
                                    <p className="text-sm doto-font whitespace-pre-wrap">
                                        {video.description}
                                    </p>
                                </div>
                                {video.description && video.description.length > 200 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowDescription(!showDescription)}
                                        className="mt-2 p-0 h-auto text-primary"
                                    >
                                        {showDescription ? "Show less" : "Show more"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <CommentSection videoId={video._id} />
                    </div>

                    {/* Related Videos Sidebar */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold doto-font-heading">
                            More Videos ({relatedVideos.length})
                        </h2>

                        <div className="space-y-3">
                            {relatedVideos.map((relatedVideo) => (
                                <Card
                                    key={relatedVideo._id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/watch/${relatedVideo._id}`)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex gap-3">
                                            <div className="relative w-32 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={relatedVideo.thumbnail}
                                                    alt={relatedVideo.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                                    {formatDuration(relatedVideo.duration)}
                                                </div>
                                                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Play className="h-6 w-6 text-white" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm line-clamp-2 doto-font hover:text-primary transition-colors">
                                                    {relatedVideo.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {relatedVideo.owner?.fullname || relatedVideo.owner?.username}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>{formatNumber(relatedVideo.view)} views</span>
                                                    <span>•</span>
                                                    <span>{formatTimeAgo(relatedVideo.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {relatedVideos.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No other videos available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchVideo
