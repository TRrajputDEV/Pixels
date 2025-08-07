// src/components/analytics/components/TopVideosTable.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ThumbsUp, MessageSquare, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

const TopVideosTable = ({ videos, showDetails = false }) => {
    const navigate = useNavigate()

    const formatNumber = (num) => {
        if (!num && num !== 0) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatTimeAgo = (date) => {
        const now = new Date()
        const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60))
        
        if (diffInHours < 24) {
            return `${diffInHours}h ago`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            return `${diffInDays}d ago`
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Top Performing Videos
                </CardTitle>
                <CardDescription>
                    Your most successful content ranked by views
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {videos.length > 0 ? (
                        videos.slice(0, showDetails ? 10 : 5).map((video, index) => (
                            <div key={video._id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-shrink-0 text-center w-8">
                                    <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                                </div>
                                
                                <div className="relative w-20 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                        {formatDuration(video.duration)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium line-clamp-2 hover:text-primary cursor-pointer transition-colors"
                                        onClick={() => navigate(`/watch/${video._id}`)}>
                                        {video.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {formatNumber(video.view)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {formatNumber(video.likeCount || 0)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {formatNumber(video.commentCount || 0)}
                                        </div>
                                        <span>{formatTimeAgo(video.createdAt)}</span>
                                        <Badge variant={video.isPublished ? "default" : "secondary"} className="text-xs">
                                            {video.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                </div>

                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/edit-video/${video._id}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No video data available</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TopVideosTable
