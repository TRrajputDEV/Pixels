// src/components/channel/ChannelPage.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Users,
    Video,
    Eye,
    Calendar,
    MapPin,
    Link as LinkIcon,
    Play,
    Grid3X3,
    List,
    Clock,
    ThumbsUp,
    MessageSquare,
    Share2,
    Flag,
    Loader2,
    AlertCircle,
    MoreHorizontal
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import SubscribeButton from "@/components/ui/SubscribeButton"
import userService from "@/services/UserService"
import videoService from "@/services/VideoService"
import subscriptionService from "@/services/SubscriptionService"

const ChannelPage = () => {
    const { username } = useParams()
    const { user: currentUser, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [channelData, setChannelData] = useState(null)
    const [channelVideos, setChannelVideos] = useState([])
    const [channelStats, setChannelStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [videosLoading, setVideosLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("videos")
    const [videoViewMode, setVideoViewMode] = useState("grid")

    // Fetch channel data
    useEffect(() => {
        const fetchChannelData = async () => {
            if (!username) {
                setError("Channel username is required")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                // Fetch channel profile data
                const profileResult = await userService.getUserChannelProfile(username)
                
                if (profileResult.success) {
                    setChannelData(profileResult.data)
                    setChannelStats({
                        subscriberCount: profileResult.data.subscriberCount || 0,
                        videosCount: profileResult.data.videosCount || 0,
                        totalViews: profileResult.data.totalViews || 0,
                        isSubscribed: profileResult.data.isSubscribed || false
                    })
                } else {
                    setError(profileResult.error || "Channel not found")
                    return
                }

                // Fetch channel videos
                await fetchChannelVideos(profileResult.data._id)

            } catch (err) {
                setError("An error occurred while loading the channel")
                console.error("Channel fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchChannelData()
    }, [username])

    const fetchChannelVideos = async (channelId) => {
        try {
            setVideosLoading(true)
            
            // Get all videos from this channel
            const videosResult = await videoService.getAllVideos({
                page: 1,
                limit: 50,
                sortBy: 'createdAt',
                sortType: 'desc',
                owner: channelId // Filter by channel owner
            })

            if (videosResult.success) {
                const allVideos = videosResult.data.docs || videosResult.data || []
                // Filter videos by owner ID to ensure we only get this channel's videos
                const channelVideos = allVideos.filter(video => 
                    video.owner._id === channelId || video.owner === channelId
                )
                setChannelVideos(channelVideos)
            }
        } catch (error) {
            console.error("Error fetching channel videos:", error)
        } finally {
            setVideosLoading(false)
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: `${channelData?.fullname || channelData?.username} - Pixels`,
            text: `Check out ${channelData?.fullname || channelData?.username}'s channel on Pixels!`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                toast({
                    title: "Channel shared! 🚀",
                    description: "Thanks for spreading the word!",
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast({
                    title: "Link copied! 📋",
                    description: "Channel URL copied to clipboard",
                })
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                toast({
                    title: "Share failed",
                    description: "Unable to share channel",
                    variant: "destructive",
                })
            }
        }
    }

    const formatNumber = (num) => {
        if (!num && num !== 0) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

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
            }
        }
        return new Date(date).toLocaleDateString()
    }

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading channel...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !channelData) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error || "Channel not found"}</AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Channel Header */}
                <div className="space-y-6 mb-8">
                    {/* Cover Image */}
                    <div className="relative h-32 md:h-48 lg:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
                        {channelData.coverImage ? (
                            <img
                                src={channelData.coverImage}
                                alt="Channel Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Video className="h-16 w-16 text-primary/30" />
                            </div>
                        )}
                    </div>

                    {/* Channel Info */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg flex-shrink-0">
                            <AvatarImage
                                src={channelData.avatar}
                                alt={channelData.fullname}
                            />
                            <AvatarFallback className="text-2xl md:text-3xl">
                                {channelData.fullname?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Channel Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold doto-font-heading">
                                    {channelData.fullname}
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    @{channelData.username}
                                </p>
                            </div>

                            {/* Channel Stats */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {formatNumber(channelStats?.subscriberCount)} subscribers
                                </div>
                                <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    {formatNumber(channelVideos.length)} videos
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {formatNumber(channelStats?.totalViews)} total views
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {new Date(channelData.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    })}
                                </div>
                            </div>

                            {/* Channel Description */}
                            {channelData.description && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {channelData.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {/* Subscribe Button */}
                            <SubscribeButton
                                channelId={channelData._id}
                                channelName={channelData.fullname}
                                initialSubscriberCount={channelStats?.subscriberCount}
                                className="w-full md:w-auto doto-font-button"
                            />
                            
                            {/* Secondary Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="flex-1 md:flex-none"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 md:flex-none"
                                >
                                    <Flag className="mr-2 h-4 w-4" />
                                    Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Channel Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="videos" className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Videos ({channelVideos.length})
                            </TabsTrigger>
                            <TabsTrigger value="about" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                About
                            </TabsTrigger>
                        </TabsList>

                        {/* View Mode Toggle for Videos */}
                        {activeTab === "videos" && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={videoViewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setVideoViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={videoViewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setVideoViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Videos Tab */}
                    <TabsContent value="videos">
                        {videosLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : channelVideos.length > 0 ? (
                            videoViewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {channelVideos.map((video) => (
                                        <Card 
                                            key={video._id} 
                                            className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                                            onClick={() => navigate(`/watch/${video._id}`)}
                                        >
                                            <CardContent className="p-0">
                                                {/* Video Thumbnail */}
                                                <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                                        {formatDuration(video.duration)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="h-12 w-12 text-white" />
                                                    </div>
                                                </div>

                                                {/* Video Info */}
                                                <div className="p-4">
                                                    <h3 className="font-medium line-clamp-2 text-sm doto-font group-hover:text-primary transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {formatNumber(video.view)}
                                                        </div>
                                                        <span>•</span>
                                                        <span>{formatTimeAgo(video.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {channelVideos.map((video) => (
                                        <Card 
                                            key={video._id} 
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => navigate(`/watch/${video._id}`)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    <div className="relative w-32 h-20 rounded overflow-hidden bg-muted flex-shrink-0 group">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                                            {formatDuration(video.duration)}
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Play className="h-6 w-6 text-white" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium line-clamp-2 doto-font hover:text-primary transition-colors">
                                                            {video.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {video.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                {formatNumber(video.view)} views
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <ThumbsUp className="h-3 w-3" />
                                                                {formatNumber(video.likeCount || 0)} likes
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-3 w-3" />
                                                                {formatNumber(video.commentCount || 0)} comments
                                                            </div>
                                                            <span>{formatTimeAgo(video.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12">
                                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-xl font-semibold mb-2">No Videos Yet</h3>
                                <p className="text-muted-foreground">
                                    This channel hasn't uploaded any videos yet.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    {/* About Tab */}
                    <TabsContent value="about">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Channel Details */}
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Channel Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Full Name</p>
                                                <p className="font-medium">{channelData.fullname}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Username</p>
                                                <p className="font-medium">@{channelData.username}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Joined</p>
                                                <p className="font-medium">
                                                    {new Date(channelData.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Channel Description */}
                                {channelData.description && (
                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">About</h3>
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {channelData.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Channel Stats */}
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                                <div className="text-2xl font-bold text-primary">
                                                    {formatNumber(channelStats?.subscriberCount)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Subscribers</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-500">
                                                    {formatNumber(channelVideos.length)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Videos</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-500">
                                                    {formatNumber(channelStats?.totalViews)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">Total Views</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-500">
                                                    {channelVideos.length > 0 
                                                        ? Math.floor(channelStats?.totalViews / channelVideos.length) 
                                                        : 0
                                                    }
                                                </div>
                                                <div className="text-sm text-muted-foreground">Avg Views</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ChannelPage
