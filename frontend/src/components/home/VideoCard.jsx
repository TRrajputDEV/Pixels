// src/components/home/VideoCard.jsx
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Clock, User } from 'lucide-react';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const formatViews = (views) => {
        const viewCount = views || 0;
        if (viewCount >= 1000000) {
            return `${(viewCount / 1000000).toFixed(1)}M`;
        } else if (viewCount >= 1000) {
            return `${(viewCount / 1000).toFixed(1)}K`;
        }
        return `${viewCount}`;
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 30) {
                return `${diffInDays}d ago`;
            } else if (diffInDays < 365) {
                const diffInMonths = Math.floor(diffInDays / 30);
                return `${diffInMonths}mo ago`;
            } else {
                const diffInYears = Math.floor(diffInDays / 365);
                return `${diffInYears}y ago`;
            }
        }
    };

    const formatDuration = (duration) => {
        if (typeof duration === 'string') return duration;
        if (typeof duration === 'number') {
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return '0:00';
    };

    // Fallback for missing data
    const safeVideo = {
        _id: video?._id || '',
        title: video?.title || 'Untitled Video',
        thumbnail: video?.thumbnail || '/placeholder-video.jpg',
        duration: video?.duration || 0,
        view: video?.view || video?.views || 0,
        createdAt: video?.createdAt || new Date(),
        owner: {
            fullname: video?.owner?.fullname || 'Unknown Creator',
            username: video?.owner?.username || 'unknown',
            avatar: video?.owner?.avatar || '/placeholder-avatar.jpg'
        },
        isPublished: video?.isPublished !== false
    };

    return (
        <Card 
            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border-0"
            onClick={() => navigate(`/watch/${safeVideo._id}`)}
        >
            {/* Thumbnail with metadata */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={safeVideo.thumbnail}
                    alt={safeVideo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = '/placeholder-video.jpg';
                    }}
                />
                
                {/* Duration */}
                <Badge 
                    variant="secondary" 
                    className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground flex items-center gap-1 px-2 py-1"
                >
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-medium">{formatDuration(safeVideo.duration)}</span>
                </Badge>
                
                {/* Status Badge */}
                {!safeVideo.isPublished && (
                    <Badge 
                        variant="outline" 
                        className="absolute top-3 left-3 bg-destructive/80 backdrop-blur-sm text-destructive-foreground px-2 py-1"
                    >
                        <span className="text-xs font-medium">UNLISTED</span>
                    </Badge>
                )}
            </div>

            {/* Card Content - Video Metadata */}
            <CardContent className="p-4 pb-2">
                <h3 className="font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors doto-font text-base">
                    {safeVideo.title}
                </h3>
                
                <div className="flex items-center gap-3 text-muted-foreground mt-3 text-sm">
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViews(safeVideo.view)} views</span>
                    </div>
                    <span className="text-muted">•</span>
                    <span>{formatTimeAgo(safeVideo.createdAt)}</span>
                </div>
            </CardContent>

            {/* Card Footer - Creator Info */}
            <CardFooter className="p-4 pt-0">
                <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full border border-border overflow-hidden flex-shrink-0">
                            <img
                                src={safeVideo.owner.avatar}
                                alt={safeVideo.owner.fullname}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder-avatar.jpg';
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                            {safeVideo.owner.fullname}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            @{safeVideo.owner.username}
                        </p>
                    </div>
                    
                    <Button 
                        size="sm"
                        variant="outline"
                        className="doto-font-button text-xs h-7 px-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/channel/${safeVideo.owner.username}`);
                        }}
                    >
                        View
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default VideoCard;