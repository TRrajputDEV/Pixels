// src/components/home/VideoCard.jsx
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();

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
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
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
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {video.owner.fullname}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatViews(video.views)} views • {formatTimeAgo(video.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
