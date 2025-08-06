// src/components/watch/WatchVideo.jsx
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import videoService from "@/services/VideoService"
import CommentSection from "@/components/comments/CommentSection"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
    ThumbsUp,
    ThumbsDown,
    Share,
    Download,
    Flag,
    Eye,
    Calendar,
    Clock,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    AlertCircle,
    Loader2
} from "lucide-react"

const WatchVideo = () => {
    const { videoId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const videoRef = useRef(null)

    // Video data state
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Video player state
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)

    // Interaction state
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)
    const [showDescription, setShowDescription] = useState(false)

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
                const result = await videoService.getVideoById(videoId)

                if (result.success) {
                    setVideo(result.data)
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
    }, [videoId])

    // Video player event handlers
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const newTime = (clickX / rect.width) * duration

        if (videoRef.current) {
            videoRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
        }
    }

    const toggleMute = () => {
        const newMuted = !isMuted
        setIsMuted(newMuted)
        if (videoRef.current) {
            videoRef.current.muted = newMuted
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`
        }
        return views?.toString() || '0'
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Handle like/dislike (placeholder for future implementation)
    const handleLike = () => {
        setIsLiked(!isLiked)
        if (isDisliked) setIsDisliked(false)
    }

    const handleDislike = () => {
        setIsDisliked(!isDisliked)
        if (isLiked) setIsLiked(false)
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        // Add toast notification here
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading video...</p>
                </div>
            </div>
        )
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error || "Video not found"}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Video Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Video Player */}
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                            <video
                                ref={videoRef}
                                src={video.videoFile}
                                poster={video.thumbnail}
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onMouseMove={() => setShowControls(true)}
                                onMouseLeave={() => setShowControls(false)}
                            />

                            {/* Video Controls */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'
                                }`}>
                                {/* Play/Pause Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="w-16 h-16 bg-black/50 hover:bg-black/70 text-white"
                                        onClick={handlePlayPause}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-8 w-8" />
                                        ) : (
                                            <Play className="h-8 w-8" />
                                        )}
                                    </Button>
                                </div>

                                {/* Bottom Controls */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    {/* Progress Bar */}
                                    <div
                                        className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                                        onClick={handleSeek}
                                    >
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        />
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-white hover:bg-white/20"
                                                onClick={handlePlayPause}
                                            >
                                                {isPlaying ? (
                                                    <Pause className="h-5 w-5" />
                                                ) : (
                                                    <Play className="h-5 w-5" />
                                                )}
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-white hover:bg-white/20"
                                                onClick={toggleMute}
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="h-5 w-5" />
                                                ) : (
                                                    <Volume2 className="h-5 w-5" />
                                                )}
                                            </Button>

                                            <div className="text-sm">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-white hover:bg-white/20"
                                            >
                                                <Settings className="h-5 w-5" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-white hover:bg-white/20"
                                                onClick={toggleFullscreen}
                                            >
                                                <Maximize className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold doto-font-heading mb-2">
                                    {video.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {formatViews(video.view)} views
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(video.createdAt)}
                                    </div>
                                    <Badge variant="secondary">
                                        {video.isPublished ? 'Published' : 'Unlisted'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    variant={isLiked ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleLike}
                                    className="doto-font-button"
                                >
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Like
                                </Button>

                                <Button
                                    variant={isDisliked ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={handleDislike}
                                    className="doto-font-button"
                                >
                                    <ThumbsDown className="h-4 w-4 mr-2" />
                                    Dislike
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="doto-font-button"
                                >
                                    <Share className="h-4 w-4 mr-2" />
                                    Share
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="doto-font-button"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="doto-font-button"
                                >
                                    <Flag className="h-4 w-4 mr-2" />
                                    Report
                                </Button>
                            </div>

                            <Separator />

                            {/* Channel Info */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={video.owner?.avatar}
                                        alt={video.owner?.fullname}
                                    />
                                    <AvatarFallback>
                                        {video.owner?.fullname?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold doto-font">
                                                {video.owner?.fullname || video.owner?.username}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                @{video.owner?.username}
                                            </p>
                                        </div>

                                        <Button className="doto-font-button">
                                            Subscribe
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <p className={`text-sm ${!showDescription ? 'line-clamp-2' : ''}`}>
                                            {video.description}
                                        </p>

                                        {video.description?.length > 150 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowDescription(!showDescription)}
                                                className="text-primary p-0 h-auto font-normal"
                                            >
                                                {showDescription ? 'Show less' : 'Show more'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />
                        {/* Comments Section */}
                        <CommentSection videoId={videoId} />

                        
                    </div>

                    {/* Sidebar - Related Videos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold doto-font-heading">
                            Related Videos
                        </h3>

                        {/* Placeholder for related videos */}
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                    <CardContent className="p-3">
                                        <div className="flex gap-3">
                                            <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                                                <Play className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-medium line-clamp-2">
                                                    Related Video Title {i}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Channel Name
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    1.2M views • 2 days ago
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchVideo
