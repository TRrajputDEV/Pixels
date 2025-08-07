// src/components/analytics/components/ViewsChart.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ViewsChart = ({ data }) => {
    // Generate sample data for the chart (replace with real data from backend)
    const chartData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(Math.random() * 1000) + 100,
        subscribers: Math.floor(Math.random() * 50) + 10
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Views & Subscribers Trend</CardTitle>
                <CardDescription>Track your growth over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="views" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2}
                                dot={false}
                                name="Views"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="subscribers" 
                                stroke="hsl(142 76% 36%)" 
                                strokeWidth={2}
                                dot={false}
                                name="Subscribers"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ViewsChart
