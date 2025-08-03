// src/components/home/VideoGrid.jsx
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video rounded-xl mb-3 border border-emerald-900/30"></div>
                        <div className="flex space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-emerald-900/30"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded w-4/5"></div>
                                <div className="h-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded w-3/5"></div>
                                <div className="h-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded w-2/5"></div>
                            </div>
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