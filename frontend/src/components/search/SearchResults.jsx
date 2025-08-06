// src/components/search/SearchResults.jsx
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    Filter,
    Calendar,
    Eye,
    Clock,
    AlertCircle,
    Loader2,
    Play
} from "lucide-react"
import VideoGrid from "@/components/home/VideoGrid"
import videoService from "@/services/VideoService"

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    
    // Get search query from URL
    const initialQuery = searchParams.get('q') || ''
    
    // State
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [totalResults, setTotalResults] = useState(0)
    
    // Filters
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortType, setSortType] = useState('desc')
    const [showFilters, setShowFilters] = useState(false)

    // Search function
    const performSearch = async (query = searchQuery, filters = {}) => {
        if (!query.trim()) {
            setError("Please enter a search term")
            return
        }

        try {
            setLoading(true)
            setError(null)
            
            const result = await videoService.searchVideos(query, {
                page: 1,
                limit: 20,
                sortBy: filters.sortBy || sortBy,
                sortType: filters.sortType || sortType
            })
            
            if (result.success) {
                const videosData = result.data.docs || result.data || []
                setVideos(videosData)
                setTotalResults(result.data.totalDocs || videosData.length)
                
                // Update URL with search query
                setSearchParams({ q: query })
            } else {
                setError(result.error || "Failed to search videos")
                setVideos([])
            }
        } catch (err) {
            setError("An error occurred while searching")
            setVideos([])
            console.error("Search error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Initial search when component mounts or query changes
    useEffect(() => {
        if (initialQuery) {
            setSearchQuery(initialQuery)
            performSearch(initialQuery)
        }
    }, [initialQuery])

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault()
        performSearch()
    }

    // Handle filter changes
    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy)
        performSearch(searchQuery, { sortBy: newSortBy, sortType })
    }

    const handleSortTypeChange = (newSortType) => {
        setSortType(newSortType)
        performSearch(searchQuery, { sortBy, sortType: newSortType })
    }

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`
        }
        return num.toString()
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold doto-font-heading">Search Results</h1>
                    </div>
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Search for videos..."
                                className="pl-10 pr-4 py-6 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Search"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Results Info & Filters */}
                {searchQuery && (
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <p className="text-lg">
                                    {loading ? (
                                        "Searching..."
                                    ) : (
                                        <>
                                            <span className="font-semibold">{formatNumber(totalResults)}</span>
                                            <span className="text-muted-foreground"> results for </span>
                                            <span className="font-semibold">"{searchQuery}"</span>
                                        </>
                                    )}
                                </p>
                            </div>
                            
                            {!loading && videos.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                    
                                    <Select value={sortBy} onValueChange={handleSortChange}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="createdAt">Upload Date</SelectItem>
                                            <SelectItem value="view">View Count</SelectItem>
                                            <SelectItem value="title">Title</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select value={sortType} onValueChange={handleSortTypeChange}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="desc">Newest</SelectItem>
                                            <SelectItem value="asc">Oldest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Advanced Filters (Collapsible) */}
                        {showFilters && (
                            <Card className="mt-4">
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Duration</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Any duration" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="short">Under 4 minutes</SelectItem>
                                                    <SelectItem value="medium">4-20 minutes</SelectItem>
                                                    <SelectItem value="long">Over 20 minutes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Upload Date</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Any time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="hour">Last hour</SelectItem>
                                                    <SelectItem value="day">Today</SelectItem>
                                                    <SelectItem value="week">This week</SelectItem>
                                                    <SelectItem value="month">This month</SelectItem>
                                                    <SelectItem value="year">This year</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Type</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All videos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="video">Video</SelectItem>
                                                    <SelectItem value="playlist">Playlist</SelectItem>
                                                    <SelectItem value="channel">Channel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Separator className="mt-6" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Search Results */}
                {loading ? (
                    <VideoGrid videos={[]} loading={true} />
                ) : videos.length > 0 ? (
                    <VideoGrid videos={videos} loading={false} />
                ) : searchQuery && !loading ? (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try different keywords or remove search filters
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("")
                                setSearchParams({})
                                navigate("/")
                            }}
                        >
                            Browse All Videos
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
                        <p className="text-muted-foreground">
                            Enter keywords to find videos on Pixels
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults
