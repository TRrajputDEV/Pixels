// src/components/dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
    ArrowUpRight
} from "lucide-react"
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import UserStats from './UserStats';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
                                Here's what's happening with your account today
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
                        {/* User Stats */}
                        <UserStats user={user} />

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Activity - Placeholder for backend */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                                    <Button variant="link" size="sm" className="text-primary">
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Placeholder for activity data */}
                                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                                            <div className="text-center">
                                                <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm">Activity data will appear here</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Content Performance - Placeholder for backend */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold">Content Performance</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Placeholder for performance metrics */}
                                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                                            <div className="text-center">
                                                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm">Performance metrics will appear here</p>
                                            </div>
                                        </div>
                                    </div>
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
                                        onClick={() => navigate('/analytics')}
                                    >
                                        <BarChart3 className="h-8 w-8 text-primary" />
                                        <span className="font-medium">View Analytics</span>
                                        <span className="text-xs text-muted-foreground">Check your stats</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Content Areas - Placeholders for future features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Comments & Engagement - Placeholder */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Recent Comments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                                        <div className="text-center">
                                            <MessageSquare className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
                                            <p className="text-xs">Comments will appear here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* Revenue/Monetization - Placeholder */}
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Growth Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                                        <div className="text-center">
                                            <TrendingUp className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
                                            <p className="text-xs">Growth data will appear here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;