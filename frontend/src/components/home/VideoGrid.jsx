// src/components/home/VideoGrid.jsx
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse rounded-xl overflow-hidden bg-card">
                        {/* Thumbnail skeleton */}
                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
                        
                        {/* Content skeleton */}
                        <div className="p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
                                </div>
                            </div>
                            <div className="mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
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