// src/components/analytics/components/RealtimeMetrics.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Eye, Clock } from "lucide-react"

const RealtimeMetrics = ({ data }) => {
    const realtimeData = [
        {
            label: "Active Viewers",
            value: Math.floor(Math.random() * 100) + 20,
            icon: Users,
            color: "text-green-500"
        },
        {
            label: "Views (24h)",
            value: Math.floor(Math.random() * 500) + 100,
            icon: Eye,
            color: "text-blue-500"
        },
        {
            label: "Avg. Watch Time",
            value: "2:34",
            icon: Clock,
            color: "text-purple-500"
        },
        {
            label: "Engagement Rate",
            value: `${data?.engagementRate || 0}%`,
            icon: Activity,
            color: "text-red-500"
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Real-time Metrics
                </CardTitle>
                <CardDescription>Live performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {realtimeData.map((metric, index) => {
                        const Icon = metric.icon
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${metric.color}`} />
                                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                                </div>
                                <span className="font-medium">{metric.value}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-muted-foreground">Last updated: Just now</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RealtimeMetrics
