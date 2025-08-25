// src/components/search/SearchResults.jsx - Enhanced with Smart Search
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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
    Play,
    Sparkles,
    Lightbulb
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
    
    // 🌟 NEW: Smart Search Features
    const [exploreMode, setExploreMode] = useState(false)
    const [extractedIntents, setExtractedIntents] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    
    // Filters
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortType, setSortType] = useState('desc')
    const [showFilters, setShowFilters] = useState(false)

    // Intent Suggestions
    const intentSuggestions = [
        "🎭 Make me laugh",
        "🧠 Teach me something new", 
        "🎲 Surprise me completely",
        "😌 Help me relax",
        "⚡ Something quick (under 5 min)",
        "🏋️ Workout motivation",
        "🍳 Cooking inspiration",
        "💻 Learn coding",
        "🎵 Music to vibe to"
    ];

    // 🚀 Enhanced search function using smart search
    const performSearch = async (query = searchQuery, filters = {}) => {
        if (!query.trim()) {
            setError("Please enter a search term")
            return
        }

        try {
            setLoading(true)
            setError(null)
            
            // Use smart search API
            const result = await videoService.smartSearch(query, {
                exploreMode: exploreMode.toString(),
                page: 1,
                limit: 20,
                sortBy: filters.sortBy || sortBy,
                sortType: filters.sortType || sortType
            })
            
            if (result.success) {
                const videosData = result.data.videos || []
                setVideos(videosData)
                setTotalResults(videosData.length)
                setExtractedIntents(result.data.extractedIntents)
                setSuggestions(result.data.suggestions || [])
                
                // Update URL with search query
                setSearchParams({ 
                    q: query,
                    ...(exploreMode && { explore: 'true' })
                })
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
            setExploreMode(searchParams.get('explore') === 'true')
            performSearch(initialQuery)
        }
    }, [initialQuery])

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault()
        performSearch()
    }

    // Handle suggestion clicks
    const handleSuggestionClick = (suggestion) => {
        const cleanSuggestion = suggestion.replace(/^[🎭🧠🎲😌⚡🏋️🍳💻🎵]\s/, '')
        setSearchQuery(cleanSuggestion)
        performSearch(cleanSuggestion)
    }

    // Handle explore mode toggle
    const handleExploreModeChange = (checked) => {
        setExploreMode(checked)
        if (searchQuery.trim()) {
            performSearch(searchQuery)
        }
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
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                
                {/* Enhanced Search Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold">
                            {exploreMode ? ' Smart Explore' : 'Search Results'}
                        </h1>
                    </div>
                    
                    {/* Enhanced Search Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Try natural language: 'something funny', 'teach me coding', 'surprise me'..."
                                className="pl-10 pr-32 py-6 text-lg"
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

                        {/* 🌟 Exploration Mode Toggle */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <Switch
                                        checked={exploreMode}
                                        onCheckedChange={handleExploreModeChange}
                                    />
                                    <div className="flex items-center space-x-1">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Explore Something New</span>
                                    </div>
                                </label>
                                {exploreMode && (
                                    <Badge variant="secondary" className="bg-primary/10">
                                        Discovery Mode
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Intent Suggestions */}
                        {!searchQuery && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Try these:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {intentSuggestions.slice(0, 6).map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* 🎯 Intent Detection Results */}
                {extractedIntents && (extractedIntents.tags.length > 0 || extractedIntents.mood) && (
                    <div className="mb-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="font-medium text-sm">I understood you're looking for:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {extractedIntents.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="bg-primary/10">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {extractedIntents.mood && (
                                        <Badge className="bg-primary text-primary-foreground">
                                            {extractedIntents.mood} mood
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

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
                                            {exploreMode && (
                                                <span className="text-primary"> (exploring new content)</span>
                                            )}
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
                                            <SelectItem value="relevanceScore">Relevance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select value={sortType} onValueChange={handleSortTypeChange}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="desc">High to Low</SelectItem>
                                            <SelectItem value="asc">Low to High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Advanced Filters (same as before) */}
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
                                                    <SelectItem value="short">Under 5 minutes</SelectItem>
                                                    <SelectItem value="medium">5-20 minutes</SelectItem>
                                                    <SelectItem value="long">Over 20 minutes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Mood</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Any mood" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="funny">Funny</SelectItem>
                                                    <SelectItem value="educational">Educational</SelectItem>
                                                    <SelectItem value="chill">Chill</SelectItem>
                                                    <SelectItem value="exciting">Exciting</SelectItem>
                                                    <SelectItem value="inspiring">Inspiring</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Category</label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tech">Tech</SelectItem>
                                                    <SelectItem value="comedy">Comedy</SelectItem>
                                                    <SelectItem value="education">Education</SelectItem>
                                                    <SelectItem value="cooking">Cooking</SelectItem>
                                                    <SelectItem value="fitness">Fitness</SelectItem>
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

                {/* Search Results with Exploration Indicators */}
                {loading ? (
                    <VideoGrid videos={[]} loading={true} />
                ) : videos.length > 0 ? (
                    <div>
                        {exploreMode && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-purple/5 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-2 text-primary">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="font-medium">
                                        🌟 Showing you content outside your usual interests!
                                    </span>
                                </div>
                            </div>
                        )}
                        <VideoGrid videos={videos} loading={false} />
                    </div>
                ) : searchQuery && !loading ? (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-6">
                            {exploreMode 
                                ? "Try turning off exploration mode or different keywords"
                                : "Try different keywords or enable exploration mode for broader results"
                            }
                        </p>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setExploreMode(!exploreMode)
                                    if (searchQuery.trim()) performSearch(searchQuery)
                                }}
                            >
                                {exploreMode ? 'Try Normal Search' : 'Try Exploration Mode'}
                            </Button>
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
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Smart Search is Ready!</h3>
                        <p className="text-muted-foreground mb-4">
                            Use natural language to find exactly what you're looking for
                        </p>
                        <div className="max-w-md mx-auto">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {intentSuggestions.slice(6).map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        className="text-left justify-start h-auto py-2 px-3"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults
