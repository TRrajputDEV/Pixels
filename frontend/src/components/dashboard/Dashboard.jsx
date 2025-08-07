// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
    Upload, 
    User, 
    BarChart3, 
    Eye, 
    Clock, 
    Users, 
    MessageSquare,
    TrendingUp,
    Video,
    Calendar,
    ArrowUpRight,
    ThumbsUp,
    Play,
    AlertCircle,
    Loader2,
    Edit,
    Trash2,
    MoreHorizontal
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import ProfileCard from './ProfileCard';
import UserStats from './UserStats';
import dashboardService from '@/services/DashboardService';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // State for dashboard data
    const [stats, setStats] = useState(null);
    const [recentVideos, setRecentVideos] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats
                const statsResult = await dashboardService.getChannelStats();
                if (statsResult.success) {
                    setStats(statsResult.data);
                } else {
                    setError(statsResult.error || "Failed to load stats");
                }

                // Fetch recent videos (latest 5)
                const videosResult = await dashboardService.getChannelVideos({
                    page: 1,
                    limit: 5,
                    sortBy: 'createdAt',
                    sortType: 'desc'
                });

                if (videosResult.success) {
                    setRecentVideos(videosResult.data.videos || []);
                } else {
                    console.error("Failed to load videos:", videosResult.error);
                }

            } catch (err) {
                setError("An error occurred while loading dashboard data");
                console.error("Dashboard error:", err);
            } finally {
                setLoadingStats(false);
                setLoadingVideos(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num?.toString() || '0';
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-muted/40">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight doto-font-heading">
                                Welcome back, {user?.fullname || 'User'}!
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Here's what's happening with your channel today
                            </p>
                        </div>
                        <Badge variant="secondary" className="hidden sm:inline-flex">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date().toLocaleDateString()}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <ProfileCard user={user} />
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Enhanced User Stats with Real Data */}
                        {loadingStats ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                            <div className="h-8 bg-muted rounded w-1/2"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Total Videos */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                                                <p className="text-2xl font-bold">{stats?.totalVideos || 0}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {stats?.videosThisMonth || 0} this month
                                                </p>
                                            </div>
                                            <Video className="h-8 w-8 text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Views */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                                <p className="text-2xl font-bold">{formatNumber(stats?.totalViews || 0)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Avg: {formatNumber(stats?.averageViewsPerVideo || 0)} per video
                                                </p>
                                            </div>
                                            <Eye className="h-8 w-8 text-green-500" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Subscribers */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                                                <p className="text-2xl font-bold">{formatNumber(stats?.totalSubscribers || 0)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Growth: +{stats?.subscribersGrowth || 0}%
                                                </p>
                                            </div>
                                            <Users className="h-8 w-8 text-blue-500" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Likes */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                                                <p className="text-2xl font-bold">{formatNumber(stats?.totalLikes || 0)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {stats?.engagementRate || 0}% engagement
                                                </p>
                                            </div>
                                            <ThumbsUp className="h-8 w-8 text-red-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Videos */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold">Recent Videos</CardTitle>
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="text-primary"
                                        onClick={() => navigate('/my-videos')}
                                    >
                                        View All
                                        <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loadingVideos ? (
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex gap-3 animate-pulse">
                                                    <div className="w-16 h-12 bg-muted rounded"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                                        <div className="h-3 bg-muted rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : recentVideos.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentVideos.map((video) => (
                                                <div key={video._id} className="flex items-center gap-3 group">
                                                    <div className="relative w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                                        <img
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Play className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm line-clamp-2 group-hover:text-primary cursor-pointer transition-colors"
                                                           onClick={() => navigate(`/watch/${video._id}`)}>
                                                            {video.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            <span>{formatNumber(video.view)} views</span>
                                                            <span>•</span>
                                                            <span>{formatTimeAgo(video.createdAt)}</span>
                                                            {!video.isPublished && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                                                        Draft
                                                                    </Badge>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => navigate(`/watch/${video._id}`)}>
                                                                <Play className="mr-2 h-4 w-4" />
                                                                Watch
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => navigate(`/edit-video/${video._id}`)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                                            <div className="text-center">
                                                <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm">No videos yet</p>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="text-primary p-0 h-auto"
                                                    onClick={() => navigate('/upload')}
                                                >
                                                    Upload your first video
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Content Performance */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {loadingStats ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex justify-between animate-pulse">
                                                    <div className="h-4 bg-muted rounded w-1/3"></div>
                                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Avg. Views per Video</span>
                                                <span className="font-medium">{formatNumber(stats?.averageViewsPerVideo || 0)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                                                <span className="font-medium">{stats?.engagementRate || 0}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Videos This Week</span>
                                                <span className="font-medium">{stats?.videosThisWeek || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Total Duration</span>
                                                <span className="font-medium">{formatDuration(stats?.totalVideoDuration || 0)}</span>
                                            </div>
                                            <Separator />
                                            <div className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate('/analytics')}
                                                    className="w-full"
                                                >
                                                    <BarChart3 className="mr-2 h-4 w-4" />
                                                    View Detailed Analytics
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                                <CardDescription>
                                    Get things done faster with these shortcuts
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-auto flex flex-col items-center justify-center p-6 space-y-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                                        onClick={() => navigate('/upload')}
                                    >
                                        <Upload className="h-8 w-8 text-primary" />
                                        <span className="font-medium">Upload Video</span>
                                        <span className="text-xs text-muted-foreground">Share your content</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-auto flex flex-col items-center justify-center p-6 space-y-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                                        onClick={() => navigate('/profile')}
                                    >
                                        <User className="h-8 w-8 text-primary" />
                                        <span className="font-medium">Edit Profile</span>
                                        <span className="text-xs text-muted-foreground">Update your info</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-auto flex flex-col items-center justify-center p-6 space-y-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
                                        onClick={() => navigate('/my-videos')}
                                    >
                                        <Video className="h-8 w-8 text-primary" />
                                        <span className="font-medium">Manage Videos</span>
                                        <span className="text-xs text-muted-foreground">Edit your content</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
