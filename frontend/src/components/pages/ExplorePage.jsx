// src/components/pages/ExplorePage.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import videoService from '@/services/VideoService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Search, 
    Compass, 
    Play, 
    Eye, 
    Clock, 
    AlertCircle, 
    Filter,
    Grid,
    List,
    TrendingUp,
    Calendar,
    Heart
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const ExplorePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortType, setSortType] = useState('desc');
    const [viewMode, setViewMode] = useState('grid');
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial search from URL
    const initialSearch = searchParams.get('q') || '';
    
    // Debounce search to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Predefined categories for future expansion
    const categories = [
        { id: 'all', label: 'All Videos', icon: Grid },
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'recent', label: 'Recent', icon: Calendar },
        { id: 'popular', label: 'Popular', icon: Heart }
    ];

    const sortOptions = [
        { value: 'createdAt-desc', label: 'Latest First', icon: Calendar },
        { value: 'createdAt-asc', label: 'Oldest First', icon: Calendar },
        { value: 'views-desc', label: 'Most Viewed', icon: Eye },
        { value: 'views-asc', label: 'Least Viewed', icon: Eye },
        { value: 'title-asc', label: 'A to Z', icon: Filter },
        { value: 'title-desc', label: 'Z to A', icon: Filter }
    ];

    // Initialize search from URL
    useEffect(() => {
        if (initialSearch) {
            setSearchTerm(initialSearch);
        }
    }, [initialSearch]);

    // Fetch videos when search or filters change
    useEffect(() => {
        fetchExploreVideos(true);
    }, [debouncedSearchTerm, sortBy, sortType]);

    // Update URL when search changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) {
            params.set('q', debouncedSearchTerm);
        }
        setSearchParams(params, { replace: true });
    }, [debouncedSearchTerm, setSearchParams]);

    const fetchExploreVideos = async (resetPage = false) => {
        try {
            setLoading(resetPage);
            const currentPage = resetPage ? 1 : page;
            
            const response = await videoService.request(
                `/videos/explore?` + new URLSearchParams({
                    page: currentPage,
                    limit: 20,
                    ...(debouncedSearchTerm && { query: debouncedSearchTerm }),
                    sortBy,
                    sortType
                })
            );

            if (response.success) {
                const newVideos = response.data.videos || [];
                
                if (resetPage) {
                    setVideos(newVideos);
                    setPage(1);
                } else {
                    setVideos(prev => [...prev, ...newVideos]);
                }
                
                setHasMore(response.data.hasMore || false);
                setError(null);
            } else {
                setError(response.error || 'Failed to load videos');
            }
        } catch (err) {
            console.error('Error fetching explore videos:', err);
            setError('Something went wrong while loading videos');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    };

    const handleSortChange = (value) => {
        const [field, type] = value.split('-');
        setSortBy(field);
        setSortType(type);
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
        fetchExploreVideos(false);
    };

    const handleCategoryClick = (categoryId) => {
        // Future implementation for categories
        if (categoryId === 'trending') {
            navigate('/trending');
        } else if (categoryId === 'recent') {
            setSortBy('createdAt');
            setSortType('desc');
        } else if (categoryId === 'popular') {
            setSortBy('views');
            setSortType('desc');
        }
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

    if (loading && videos.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    
                    {/* Search Skeleton */}
                    <div className="flex gap-4 mb-8">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    
                    {/* Categories Skeleton */}
                    <div className="flex gap-2 mb-8">
                        {Array(4).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-20" />
                        ))}
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

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Compass className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Explore</h1>
                    {videos.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            • {videos.length} videos
                        </span>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for videos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <Select value={`${sortBy}-${sortType}`} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-md border">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="rounded-r-none"
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="rounded-l-none"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Badge
                                key={category.id}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <Icon className="h-3 w-3 mr-1" />
                                {category.label}
                            </Badge>
                        );
                    })}
                </div>

                {/* Error State */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Empty State */}
                {!loading && videos.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            {debouncedSearchTerm ? 'No results found' : 'Start exploring!'}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {debouncedSearchTerm 
                                ? `Try different keywords or browse all videos` 
                                : 'Discover amazing videos from creators around the world'
                            }
                        </p>
                        {debouncedSearchTerm && (
                            <Button onClick={() => setSearchTerm('')} variant="outline">
                                Clear Search
                            </Button>
                        )}
                    </div>
                )}

                {/* Video Grid/List */}
                {videos.length > 0 && (
                    <div className={
                        viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                    }>
                        {videos.map((video) => (
                            <Card 
                                key={video._id} 
                                className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${
                                    viewMode === 'list' ? 'flex flex-row' : ''
                                }`}
                                onClick={() => handleVideoClick(video._id)}
                            >
                                {/* Thumbnail */}
                                <div className={`relative overflow-hidden ${
                                    viewMode === 'list' ? 'w-48 h-28' : 'aspect-video'
                                }`}>
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
                                </div>

                                {/* Content */}
                                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <h3 className={`font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors ${
                                        viewMode === 'list' ? 'text-base' : 'text-sm'
                                    }`}>
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

                                    {/* Description for list view */}
                                    {viewMode === 'list' && video.description && (
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                            {video.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && !loading && (
                    <div className="text-center mt-12">
                        <Button 
                            variant="outline" 
                            size="lg"
                            onClick={handleLoadMore}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load More Videos'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
