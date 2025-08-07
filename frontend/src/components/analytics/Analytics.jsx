// src/components/analytics/Analytics.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    BarChart3,
    TrendingUp,
    Eye,
    ThumbsUp,
    MessageSquare,
    Users,
    Clock,
    Play,
    Loader2,
    AlertCircle,
    Calendar,
    Target,
    Activity,
    VideoIcon,
    Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import analyticsService from "@/services/AnalyticsService"
import dashboardService from "@/services/DashboardService"

// Import chart components
import OverviewMetrics from "./components/OverviewMetrics"
import ViewsChart from "./components/ViewsChart"
import EngagementChart from "./components/EngagementChart"
import TopVideosTable from "./components/TopVideosTable"
import AudienceInsights from "./components/AudienceInsights"
import RealtimeMetrics from "./components/RealtimeMetrics"

const Analytics = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // State
    const [analyticsData, setAnalyticsData] = useState(null)
    const [videosData, setVideosData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dateRange, setDateRange] = useState('30d')
    const [selectedTab, setSelectedTab] = useState('overview')

    // Fetch analytics data
    useEffect(() => {
        fetchAnalyticsData()
    }, [dateRange])

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch main analytics data (using existing dashboard service)
            const statsResult = await dashboardService.getChannelStats()
            
            if (statsResult.success) {
                setAnalyticsData(statsResult.data)
            } else {
                setError(statsResult.error || "Failed to load analytics data")
            }

            // Fetch video performance data
            const videosResult = await dashboardService.getChannelVideos({
                page: 1,
                limit: 20,
                sortBy: 'view',
                sortType: 'desc'
            })

            if (videosResult.success) {
                setVideosData(videosResult.data.videos || [])
            }

        } catch (err) {
            setError("An error occurred while loading analytics")
            console.error("Analytics error:", err)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num) => {
        if (!num && num !== 0) return '0'
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    const getDateRangeLabel = (range) => {
        switch (range) {
            case '7d': return 'Last 7 days'
            case '30d': return 'Last 30 days'
            case '90d': return 'Last 90 days'
            case '1y': return 'Last year'
            default: return 'Last 30 days'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
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
        <div className="min-h-screen bg-background pt-16">
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
                            <h1 className="text-3xl font-bold doto-font-heading">Channel Analytics</h1>
                            <p className="text-muted-foreground">
                                Comprehensive insights into your video performance
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-40">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="1y">Last year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                    
                    {/* Quick Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {formatNumber(analyticsData?.totalViews || 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Views</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-500">
                                    {formatNumber(analyticsData?.totalSubscribers || 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Subscribers</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-500">
                                    {analyticsData?.totalVideos || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Videos</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-500">
                                    {analyticsData?.engagementRate || 0}%
                                </div>
                                <div className="text-sm text-muted-foreground">Engagement</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Analytics Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="content" className="flex items-center gap-2">
                            <VideoIcon className="h-4 w-4" />
                            Content
                        </TabsTrigger>
                        <TabsTrigger value="audience" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Audience
                        </TabsTrigger>
                        <TabsTrigger value="engagement" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Engagement
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OverviewMetrics data={analyticsData} />
                            <ViewsChart data={analyticsData} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <TopVideosTable videos={videosData} />
                            </div>
                            <RealtimeMetrics data={analyticsData} />
                        </div>
                    </TabsContent>

                    {/* Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <VideoIcon className="h-5 w-5" />
                                        Content Performance
                                    </CardTitle>
                                    <CardDescription>
                                        How your videos are performing over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Average Views per Video</span>
                                            <span className="font-medium">{formatNumber(analyticsData?.averageViewsPerVideo || 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Videos This Month</span>
                                            <span className="font-medium">{analyticsData?.videosThisMonth || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Total Duration</span>
                                            <span className="font-medium">{Math.floor((analyticsData?.totalVideoDuration || 0) / 60)} minutes</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Published Videos</span>
                                            <span className="font-medium">{analyticsData?.totalVideos || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Performance Goals
                                    </CardTitle>
                                    <CardDescription>
                                        Track your progress towards channel goals
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>1K Subscribers Goal</span>
                                                <span>{Math.min(((analyticsData?.totalSubscribers || 0) / 1000 * 100), 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                                                    style={{ width: `${Math.min(((analyticsData?.totalSubscribers || 0) / 1000 * 100), 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>100K Views Goal</span>
                                                <span>{Math.min(((analyticsData?.totalViews || 0) / 100000 * 100), 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                                    style={{ width: `${Math.min(((analyticsData?.totalViews || 0) / 100000 * 100), 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <TopVideosTable videos={videosData} showDetails={true} />
                    </TabsContent>

                    {/* Audience Tab */}
                    <TabsContent value="audience" className="space-y-6">
                        <AudienceInsights data={analyticsData} />
                    </TabsContent>

                    {/* Engagement Tab */}
                    <TabsContent value="engagement" className="space-y-6">
                        <EngagementChart data={analyticsData} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Analytics
