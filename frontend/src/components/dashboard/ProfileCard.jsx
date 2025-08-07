// src/components/dashboard/ProfileCard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    Edit3, 
    LogOut, 
    Mail, 
    Calendar, 
    Video,
    Users,
    Heart,
    Loader2,
    Eye,
    ThumbsUp,
    TrendingUp
} from "lucide-react"
import dashboardService from '@/services/DashboardService'

const ProfileCard = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Fetch user stats
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                setLoadingStats(true);
                const result = await dashboardService.getChannelStats();
                
                if (result.success) {
                    setStats(result.data);
                } else {
                    console.error("Failed to load user stats:", result.error);
                }
            } catch (error) {
                console.error("Error fetching user stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const result = await logout();
        if (result.success) {
            navigate('/');
        }
        setIsLoggingOut(false);
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const formatNumber = (num) => {
        if (!num && num !== 0) return '0';
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toString();
    };

    const getEngagementLevel = () => {
        if (!stats) return { level: 'New Creator', color: 'text-muted-foreground' };
        
        const { totalVideos, totalViews, totalSubscribers } = stats;
        
        if (totalVideos >= 10 && totalViews >= 10000 && totalSubscribers >= 100) {
            return { level: 'Pro Creator', color: 'text-yellow-500' };
        } else if (totalVideos >= 5 && totalViews >= 1000) {
            return { level: 'Active Creator', color: 'text-blue-500' };
        } else if (totalVideos >= 1) {
            return { level: 'New Creator', color: 'text-green-500' };
        }
        return { level: 'Getting Started', color: 'text-muted-foreground' };
    };

    const engagementInfo = getEngagementLevel();

    return (
        <Card className="overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 w-full relative bg-muted">
                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-full w-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-primary/30" />
                    </div>
                )}
                {/* Creator Badge */}
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">
                        <Video className="mr-1 h-3 w-3" />
                        Creator
                    </Badge>
                </div>
            </div>

            <CardContent className="px-6 pb-6 relative -mt-12">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage 
                            src={user?.avatar} 
                            alt={user?.fullname || 'User'} 
                        />
                        <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                            {getInitials(user?.fullname || 'User')}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* User Details */}
                <div className="text-center space-y-1 mb-6">
                    <h3 className="text-xl font-semibold doto-font-heading">
                        {user?.fullname || 'User'}
                    </h3>
                    <p className="text-muted-foreground">
                        @{user?.username || 'username'}
                    </p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        {user?.email || 'email@example.com'}
                    </div>
                    {/* Creator Level */}
                    <div className={`text-xs font-medium ${engagementInfo.color}`}>
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {engagementInfo.level}
                    </div>
                </div>

                {/* Real Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                         onClick={() => navigate('/my-videos')}>
                        {loadingStats ? (
                            <div className="animate-pulse">
                                <div className="h-6 bg-muted rounded mb-1"></div>
                                <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <div className="font-bold text-lg text-primary">
                                    {formatNumber(stats?.totalVideos || 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">Videos</div>
                            </>
                        )}
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                         onClick={() => navigate('/analytics')}>
                        {loadingStats ? (
                            <div className="animate-pulse">
                                <div className="h-6 bg-muted rounded mb-1"></div>
                                <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <div className="font-bold text-lg text-green-500">
                                    {formatNumber(stats?.totalViews || 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">Views</div>
                            </>
                        )}
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                         onClick={() => navigate('/liked-videos')}>
                        {loadingStats ? (
                            <div className="animate-pulse">
                                <div className="h-6 bg-muted rounded mb-1"></div>
                                <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <div className="font-bold text-lg text-red-500">
                                    {formatNumber(stats?.totalLikes || 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">Likes</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Stats Summary */}
                {!loadingStats && stats && (
                    <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="font-medium">{formatNumber(stats.totalSubscribers || 0)} subscribers</span>
                            </div>
                            <div className="text-muted-foreground">
                                {stats.engagementRate || 0}% engagement
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>{stats.videosThisMonth || 0} videos this month</span>
                            <span>Avg: {formatNumber(stats.averageViewsPerVideo || 0)} views/video</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                    <Button
                        onClick={() => navigate('/profile')}
                        className="w-full doto-font-button"
                        variant="default"
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => navigate('/my-videos')}
                            variant="outline"
                            size="sm"
                        >
                            <Video className="mr-2 h-4 w-4" />
                            My Videos
                        </Button>
                        
                        <Button
                            onClick={() => navigate('/analytics')}
                            variant="outline"
                            size="sm"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Analytics
                        </Button>
                    </div>
                    
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </>
                        )}
                    </Button>
                </div>

                <Separator className="mb-4" />

                {/* Enhanced Account Info */}
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                            Joined {user?.createdAt 
                                ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long' 
                                }) 
                                : 'Recently'
                            }
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>
                            {stats?.totalVideos 
                                ? stats.totalVideos === 1 
                                    ? '1 video published' 
                                    : `${stats.totalVideos} videos published`
                                : 'Content creator'
                            }
                        </span>
                    </div>
                    {stats?.totalViews > 0 && (
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>{formatNumber(stats.totalViews)} total views</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
