// src/components/home/VideoCard.jsx
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';  // Import here

const VideoCard = ({ video }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();  // Use theme from context

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    };

    // Conditional classes based on theme
    const titleColor = theme === 'dark' ? 'text-gray-100 group-hover:text-white doto-font' : 'text-gray-900 doto-font group-hover:text-black';
    const metaColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const durationBg = theme === 'dark' ? 'bg-gray-800/80' : 'bg-black/80';

    return (
        <div
            className="group cursor-pointer"
            onClick={() => navigate(`/watch/${video._id}`)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Duration */}
                <div className={`absolute bottom-2 right-2 ${durationBg} text-white text-xs px-2 py-1 rounded`}>
                    {video.duration}
                </div>
            </div>

            {/* Video Info */}
            <div className="flex space-x-3">
                {/* Channel Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={video.owner.avatar}
                        alt={video.owner.fullname}
                        className="w-9 h-9 rounded-full"
                    />
                </div>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-extrabold line-clamp-2 transition-colors ${titleColor}`}>
                        {video.title}
                    </h3>
                    <p className={`text-sm mt-1 ${metaColor}`}>
                        {video.owner.fullname}
                    </p>
                    <p className={`text-sm ${metaColor}`}>
                        {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
