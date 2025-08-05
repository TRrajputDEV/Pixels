// src/components/home/VideoCard.jsx
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    // Theme-based classes
    const cardBg = theme === 'dark' ? 'bg-card-dark' : 'bg-card-light';
    const titleColor = theme === 'dark' ? 'text-foreground-dark' : 'text-foreground-light';
    const metaColor = theme === 'dark' ? 'text-muted-dark' : 'text-muted-light';

    return (
        <div
            className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${cardBg}`}
            onClick={() => navigate(`/watch/${video._id}`)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Live indicator */}
                {video.isLive && (
                    <div className="absolute top-3 left-3">
                        <Badge variant="destructive" className="flex items-center px-2 py-1">
                            <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                            LIVE
                        </Badge>
                    </div>
                )}
                
                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded">
                    {video.duration}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Video Info */}
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    {/* Channel Avatar */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <img
                                src={video.owner.avatar}
                                alt={video.owner.fullname}
                                className="w-10 h-10 rounded-full border-2 border-primary"
                            />
                        </div>
                    </div>

                    {/* Video Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold line-clamp-2 mb-1 transition-colors doto-font ${titleColor}`}>
                            {video.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2">
                            <p className={`text-sm ${metaColor}`}>
                                {video.owner.fullname}
                            </p>
                            {video.isLive && (
                                <Badge variant="secondary" className="text-xs">
                                    LIVE NOW
                                </Badge>
                            )}
                        </div>
                        <p className={`text-sm mt-1 ${metaColor}`}>
                            {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
                        </p>
                    </div>
                </div>
                
                {/* Action Button */}
                <div className="mt-3 flex justify-end">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="doto-font-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/watch/${video._id}`);
                        }}
                    >
                        Watch
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;