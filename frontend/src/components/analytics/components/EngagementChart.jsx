// src/components/analytics/components/EngagementChart.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ThumbsUp, MessageSquare, Share } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const EngagementChart = ({ data }) => {
    // Sample engagement data over time
    const engagementData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        likes: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 25) + 5,
        engagement: Math.floor(Math.random() * 15) + 5
    }))

    const totalEngagement = {
        likes: data?.totalLikes || 0,
        comments: 245, // Sample data - replace with real data
        shares: 89,    // Sample data - replace with real data
        engagement: data?.engagementRate || 0
    }

    return (
        <div className="space-y-6">
            {/* Engagement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <ThumbsUp className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Likes</p>
                                <p className="text-2xl font-bold">{totalEngagement.likes}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Comments</p>
                                <p className="text-2xl font-bold">{totalEngagement.comments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Share className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Shares</p>
                                <p className="text-2xl font-bold">{totalEngagement.shares}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Activity className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                                <p className="text-2xl font-bold">{totalEngagement.engagement}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Engagement Trends</CardTitle>
                    <CardDescription>Track how your audience interacts with your content over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="likes" 
                                    stackId="1"
                                    stroke="#ef4444" 
                                    fill="#ef4444"
                                    fillOpacity={0.6}
                                    name="Likes"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="comments" 
                                    stackId="1"
                                    stroke="#3b82f6" 
                                    fill="#3b82f6"
                                    fillOpacity={0.6}
                                    name="Comments"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="shares" 
                                    stackId="1"
                                    stroke="#10b981" 
                                    fill="#10b981"
                                    fillOpacity={0.6}
                                    name="Shares"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Engagement Rate Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Engagement Rate Over Time</CardTitle>
                    <CardDescription>Percentage of viewers who interact with your videos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="engagement" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={3}
                                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                                    name="Engagement Rate (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default EngagementChart
