// src/components/dashboard/ProfileCard.jsx
import { useState } from 'react';
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
    Loader2
} from "lucide-react"

const ProfileCard = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const result = await logout();
        if (result.success) {
            navigate('/login');
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

    return (
        <Card className="overflow-hidden doto-font font-extrabold text-2xl">
            {/* Cover Image */}
            <div className="h-32 w-full relative bg-muted">
                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-full w-full" />
                )}
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
                </div>

                {/* Stats Grid - Placeholder for backend data */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg">--</div>
                        <div className="text-xs text-muted-foreground">Videos</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg">--</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg">--</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                    <Button
                        onClick={() => navigate('/profile')}
                        className="w-full"
                        variant="default"
                    >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                    
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

                {/* Account Info */}
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span>Content creator</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;