// src/components/analytics/components/OverviewMetrics.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, Users, ThumbsUp, Clock } from "lucide-react"

const OverviewMetrics = ({ data }) => {
    const formatNumber = (num) => {
        if (!num && num !== 0) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const metrics = [
        {
            title: "Total Views",
            value: formatNumber(data?.totalViews || 0),
            change: "+12.5%",
            trend: "up",
            icon: Eye,
            color: "text-blue-500"
        },
        {
            title: "Subscribers",
            value: formatNumber(data?.totalSubscribers || 0),
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "text-green-500"
        },
        {
            title: "Total Likes",
            value: formatNumber(data?.totalLikes || 0),
            change: "+15.3%",
            trend: "up",
            icon: ThumbsUp,
            color: "text-red-500"
        },
        {
            title: "Watch Time",
            value: `${Math.floor((data?.totalVideoDuration || 0) / 60)}h`,
            change: "+5.1%",
            trend: "up",
            icon: Clock,
            color: "text-purple-500"
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your channel metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon
                        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
                        
                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${metric.color}`} />
                                    <span className="text-sm text-muted-foreground">{metric.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">{metric.value}</span>
                                    <div className={`flex items-center gap-1 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                        <TrendIcon className="h-3 w-3" />
                                        <span className="text-xs">{metric.change}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default OverviewMetrics
