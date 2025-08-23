// src/components/pages/TrendingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import videoService from '@/services/VideoService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Play, Eye, Clock, AlertCircle } from 'lucide-react';

const TrendingPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingVideos = async () => {
            try {
                setLoading(true);
                const response = await videoService.getTrendingVideos({ limit: 20 });
                
                if (response.success) {
                    // Handle both array and paginated responses
                    const videoList = Array.isArray(response.data) 
                        ? response.data 
                        : response.data?.docs || [];
                    setVideos(videoList);
                } else {
                    setError(response.error || 'Failed to load trending videos');
                }
            } catch (err) {
                console.error('Error fetching trending videos:', err);
                setError('Something went wrong while loading trending videos');
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingVideos();
    }, []);

    const handleVideoClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (!views) return '0 views';
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
        return `${views} views`;
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-3 mb-8">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    
                    {/* Video Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(12).fill(0).map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Skeleton className="aspect-video w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Trending</h1>
                    </div>
                    
                    <Alert variant="destructive" className="max-w-md mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    
                    <div className="text-center mt-6">
                        <Button 
                            onClick={() => window.location.reload()} 
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Trending</h1>
                    </div>
                    
                    <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Trending Videos Yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Be the first to upload content and start trending!
                        </p>
                        <Button onClick={() => navigate('/upload')}>
                            Upload Video
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Trending</h1>
                    <span className="text-sm text-muted-foreground">
                        • {videos.length} videos
                    </span>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <Card 
                            key={video._id} 
                            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                            onClick={() => handleVideoClick(video._id)}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="bg-primary/90 rounded-full p-3">
                                        <Play className="h-6 w-6 text-primary-foreground fill-current" />
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                {video.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDuration(video.duration)}
                                    </div>
                                )}

                                {/* Trending Rank Badge */}
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                    {video.title}
                                </h3>
                                
                                {/* Channel Info */}
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={video.owner?.avatar || '/default-avatar.png'}
                                        alt={video.owner?.username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-xs text-muted-foreground truncate">
                                        {video.owner?.fullname || video.owner?.username}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {formatViews(video.views || video.view)}
                                    </div>
                                    <span>•</span>
                                    <span>{formatTimeAgo(video.createdAt)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load More Button (Optional) */}
                <div className="text-center mt-12">
                    <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => {
                            // Implement pagination if needed
                            console.log('Load more videos');
                        }}
                    >
                        Load More Trending Videos
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TrendingPage;
