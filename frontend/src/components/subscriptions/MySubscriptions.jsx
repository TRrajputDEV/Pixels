// src/components/subscriptions/MySubscriptions.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    ArrowLeft,
    Users,
    Bell,
    BellOff,
    Grid3X3,
    List,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    Video,
    Calendar,
    Eye
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import subscriptionService from "@/services/SubscriptionService"
import SubscribeButton from "@/components/ui/SubscribeButton"

const MySubscriptions = () => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState("grid") // grid or list
    const [selectedTab, setSelectedTab] = useState("all")

    // Fetch subscriptions
    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!isAuthenticated || !user?._id) {
                setError("Please sign in to view subscriptions")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const result = await subscriptionService.getSubscribedChannels({ page: 1, limit: 50 })

                if (result.success) {
                    setSubscriptions(result.data.subscribedChannels || [])
                } else {
                    setError(result.error || "Failed to load subscriptions")
                }
            } catch (err) {
                setError("An error occurred while loading subscriptions")
                console.error("Subscriptions fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscriptions()
    }, [user?._id, isAuthenticated])

    // Filter subscriptions based on search
    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.channelInfo?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.channelInfo?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num?.toString() || '0'
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please sign in to view your subscriptions.
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
                    <div className="flex items-center gap-3 mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold doto-font-heading">My Subscriptions</h1>
                            <p className="text-muted-foreground">
                                Manage channels you follow • {subscriptions.length} subscriptions
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search subscriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                                {filteredSubscriptions.length} channels
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading subscriptions...</p>
                        </div>
                    </div>
                ) : filteredSubscriptions.length > 0 ? (
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="all">All Subscriptions</TabsTrigger>
                            <TabsTrigger value="recent">Recently Subscribed</TabsTrigger>
                            <TabsTrigger value="active">Most Active</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredSubscriptions.map((subscription) => (
                                        <Card 
                                            key={subscription._id} 
                                            className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                                        >
                                            <CardContent className="p-6">
                                                <div className="text-center space-y-4">
                                                    {/* Channel Avatar */}
                                                    <div 
                                                        className="relative mx-auto w-20 h-20 cursor-pointer"
                                                        onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}
                                                    >
                                                        <Avatar className="w-20 h-20 border-4 border-background shadow-lg group-hover:scale-105 transition-transform">
                                                            <AvatarImage
                                                                src={subscription.channelInfo.avatar}
                                                                alt={subscription.channelInfo.fullname}
                                                            />
                                                            <AvatarFallback className="text-2xl">
                                                                {subscription.channelInfo.fullname?.[0]?.toUpperCase() || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>

                                                    {/* Channel Info */}
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-lg doto-font hover:text-primary transition-colors cursor-pointer"
                                                            onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}>
                                                            {subscription.channelInfo.fullname}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            @{subscription.channelInfo.username}
                                                        </p>
                                                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                                            <Users className="h-3 w-3" />
                                                            {formatNumber(subscription.subscriberCount)} subscribers
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Subscribed {formatTimeAgo(subscription.subscribedAt)}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="space-y-2">
                                                        <SubscribeButton
                                                            channelId={subscription.channelInfo._id}
                                                            channelName={subscription.channelInfo.fullname}
                                                            initialSubscriberCount={subscription.subscriberCount}
                                                            size="sm"
                                                            className="w-full"
                                                            showCount={false}
                                                        />
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="w-full"
                                                            onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}
                                                        >
                                                            <Video className="mr-2 h-3 w-3" />
                                                            View Channel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSubscriptions.map((subscription) => (
                                        <Card key={subscription._id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar 
                                                        className="h-16 w-16 cursor-pointer hover:scale-105 transition-transform"
                                                        onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}
                                                    >
                                                        <AvatarImage
                                                            src={subscription.channelInfo.avatar}
                                                            alt={subscription.channelInfo.fullname}
                                                        />
                                                        <AvatarFallback className="text-lg">
                                                            {subscription.channelInfo.fullname?.[0]?.toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 space-y-1">
                                                        <h3 className="font-semibold text-lg doto-font hover:text-primary transition-colors cursor-pointer"
                                                            onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}>
                                                            {subscription.channelInfo.fullname}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            @{subscription.channelInfo.username}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-3 w-3" />
                                                                {formatNumber(subscription.subscriberCount)} subscribers
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Subscribed {formatTimeAgo(subscription.subscribedAt)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => navigate(`/channel/${subscription.channelInfo.username}`)}
                                                        >
                                                            <Video className="mr-2 h-4 w-4" />
                                                            View Channel
                                                        </Button>
                                                        <SubscribeButton
                                                            channelId={subscription.channelInfo._id}
                                                            channelName={subscription.channelInfo.fullname}
                                                            initialSubscriberCount={subscription.subscriberCount}
                                                            size="sm"
                                                            showCount={false}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="recent">
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">Recently Subscribed</h3>
                                <p className="text-muted-foreground">
                                    Shows channels you've subscribed to in the last 30 days
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="active">
                            <div className="text-center py-12">
                                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">Most Active Channels</h3>
                                <p className="text-muted-foreground">
                                    Channels that upload content most frequently
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Subscriptions Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            {searchTerm 
                                ? `No subscriptions found matching "${searchTerm}"`
                                : "Start building your personal feed by subscribing to channels you enjoy!"
                            }
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            className="doto-font-button"
                        >
                            <Video className="mr-2 h-4 w-4" />
                            Discover Channels
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MySubscriptions
