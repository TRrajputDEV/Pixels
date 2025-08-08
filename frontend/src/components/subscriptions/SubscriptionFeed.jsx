// src/components/subscriptions/SubscriptionFeed.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Bell,
    Calendar,
    Clock,
    Eye,
    Filter,
    Loader2,
    AlertCircle,
    Video,
    Play,
    Users,
    Rss
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import subscriptionService from "@/services/SubscriptionService"
import videoService from "@/services/VideoService"

const SubscriptionFeed = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [feedVideos, setFeedVideos] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortBy, setSortBy] = useState('latest')
    const [filterBy, setFilterBy] = useState('all')

    // Fetch subscription feed
    useEffect(() => {
        const fetchSubscriptionFeed = async () => {
            if (!isAuthenticated || !user?._id) {
                setError("Please sign in to view your subscription feed")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                // First, get user's subscriptions
                const subscriptionsResult = await subscriptionService.getSubscribedChannels({ page: 1, limit: 50 })

                if (subscriptionsResult.success) {
                    const userSubscriptions = subscriptionsResult.data.subscribedChannels || []
                    setSubscriptions(userSubscriptions)

                    // If user has subscriptions, fetch videos from those channels
                    if (userSubscriptions.length > 0) {
                        // For now, we'll fetch all recent videos and filter them
                        // In a real implementation, you'd fetch videos specifically from subscribed channels
                        const videosResult = await videoService.getAllVideos({
                            page: 1,
                            limit: 50,
                            sortBy: 'createdAt',
                            sortType: 'desc'
                        })

                        if (videosResult.success) {
                            const allVideos = videosResult.data.docs || videosResult.data || []
                            
                            // Filter videos to only show those from subscribed channels
                            const subscribedChannelIds = userSubscriptions.map(sub => sub.channelInfo._id)
                            const feedVideos = allVideos.filter(video => 
                                subscribedChannelIds.includes(video.owner._id)
                            )

                            setFeedVideos(feedVideos)
                        }
                    }
                } else {
                    setError(subscriptionsResult.error || "Failed to load subscription feed")
                }
            } catch (err) {
                setError("An error occurred while loading your feed")
                console.error("Feed fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscriptionFeed()
    }, [user?._id, isAuthenticated, sortBy])

    const formatTimeAgo = (date) => {
        const now = new Date()
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}d ago`
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
        return `${Math.floor(diffInDays / 30)}mo ago`
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num?.toString() || '0'
    }

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please sign in to view your subscription feed.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
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
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold doto-font-heading flex items-center gap-3">
                                <Rss className="h-8 w-8" />
                                Subscription Feed
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Latest videos from channels you follow
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="channel">By Channel</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/subscriptions')}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Manage
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            {subscriptions.length} subscriptions
                        </div>
                        <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            {feedVideos.length} new videos
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading your feed...</p>
                        </div>
                    </div>
                ) : subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Subscriptions</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            You haven't subscribed to any channels yet. Start following creators to see their latest videos here!
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => navigate('/')}
                                className="doto-font-button"
                            >
                                <Video className="mr-2 h-4 w-4" />
                                Discover Videos
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/subscriptions')}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                Browse Channels
                            </Button>
                        </div>
                    </div>
                ) : feedVideos.length === 0 ? (
                    <div className="text-center py-12">
                        <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No New Videos</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Your subscribed channels haven't uploaded new content recently. Check back later!
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Browse All Videos
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Feed Videos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {feedVideos.map((video) => (
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
                                            <div className="flex gap-3">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarImage
                                                        src={video.owner?.avatar}
                                                        alt={video.owner?.fullname}
                                                    />
                                                    <AvatarFallback>
                                                        {video.owner?.fullname?.[0]?.toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium line-clamp-2 text-sm doto-font group-hover:text-primary transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {video.owner?.fullname || video.owner?.username}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {formatNumber(video.view)}
                                                        </div>
                                                        <span>•</span>
                                                        <span>{formatTimeAgo(video.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionFeed
