// src/components/home/HomePage.jsx
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import VideoGrid from './VideoGrid';
import videoService from '@/services/VideoService';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch videos from backend
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch latest videos from your backend
                const result = await videoService.getLatestVideos({
                    page: 1,
                    limit: 20
                });
                
                if (result.success && result.data) {
                    setVideos(result.data.docs || result.data); // Handle pagination or direct array
                } else {
                    throw new Error(result.error || 'Failed to fetch videos');
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError(err.message || 'Failed to load videos');
                setVideos([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Refresh videos function (optional - for future use)
    const refreshVideos = () => {
        setVideos([]);
        setLoading(true);
        fetchVideos();
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold doto-font-heading mb-2">
                        Latest on Pixels
                    </h1>
                    <p className="text-muted-foreground">
                        Discover amazing content from our community
                    </p>
                </div>

                {/* Error State */}
                {error && !loading && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                                <button 
                                    onClick={refreshVideos}
                                    className="ml-2 underline hover:no-underline"
                                >
                                    Try again
                                </button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Video Grid */}
                <VideoGrid videos={videos} loading={loading} />

                {/* Empty State */}
                {!loading && !error && videos.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground">
                            <p className="text-lg mb-2">No videos found</p>
                            <p className="text-sm">Be the first to upload a video!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
