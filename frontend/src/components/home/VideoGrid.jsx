// src/components/home/VideoGrid.jsx
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="border-0 rounded-xl overflow-hidden bg-card shadow-sm">
                        {/* Thumbnail skeleton */}
                        <div className="aspect-video bg-muted animate-pulse" />
                        
                        {/* Content skeleton */}
                        <div className="p-4 space-y-3">
                            <div className="h-5 bg-muted rounded w-4/5 animate-pulse mb-2"></div>
                            <div className="flex gap-3">
                                <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                            </div>
                        </div>
                        
                        {/* Footer skeleton */}
                        <div className="p-4 pt-0 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                            <div className="flex-1 space-y-1">
                                <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                                <div className="h-2 bg-muted rounded w-1/2 animate-pulse"></div>
                            </div>
                            <div className="h-7 bg-muted rounded w-12 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
};

export default VideoGrid;