// src/components/analytics/components/AudienceInsights.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Clock, Smartphone } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const AudienceInsights = ({ data }) => {
    // Sample demographic data (replace with real data)
    const ageData = [
        { name: '18-24', value: 35, color: '#8884d8' },
        { name: '25-34', value: 30, color: '#82ca9d' },
        { name: '35-44', value: 20, color: '#ffc658' },
        { name: '45-54', value: 10, color: '#ff7300' },
        { name: '55+', value: 5, color: '#8dd1e1' }
    ]

    const countryData = [
        { country: 'United States', percentage: 35 },
        { country: 'Canada', percentage: 15 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Australia', percentage: 10 },
        { country: 'Germany', percentage: 8 },
        { country: 'Others', percentage: 20 }
    ]

    const deviceData = [
        { device: 'Mobile', percentage: 65 },
        { device: 'Desktop', percentage: 25 },
        { device: 'Tablet', percentage: 10 }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Age Demographics
                    </CardTitle>
                    <CardDescription>Breakdown of your audience by age groups</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ageData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {ageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Geographic Distribution
                    </CardTitle>
                    <CardDescription>Where your viewers are located</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {countryData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{item.country}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground w-10">{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Device Usage
                    </CardTitle>
                    <CardDescription>How your audience watches your content</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {deviceData.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.device}</span>
                                    <span className="text-muted-foreground">{item.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Watch Time Patterns */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Watch Time Patterns
                    </CardTitle>
                    <CardDescription>When your audience is most active</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { hour: '00', views: 20 },
                                { hour: '04', views: 15 },
                                { hour: '08', views: 45 },
                                { hour: '12', views: 80 },
                                { hour: '16', views: 95 },
                                { hour: '20', views: 75 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AudienceInsights
