// src/components/ui/VideoLikeButton.jsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import likeService from "@/services/LikeService"

const VideoLikeButton = ({ 
    videoId, 
    initialLikeCount = 0, 
    initialIsLiked = false,
    variant = "outline",
    size = "sm",
    className = ""
}) => {
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLoading, setIsLoading] = useState(false)

    // Update state when props change
    useEffect(() => {
        setIsLiked(initialIsLiked)
        setLikeCount(initialLikeCount)
    }, [initialIsLiked, initialLikeCount])

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "You must be logged in to like videos",
                variant: "destructive",
            })
            return
        }

        if (!videoId) {
            toast({
                title: "Error",
                description: "Video ID is missing",
                variant: "destructive",
            })
            return
        }

        try {
            setIsLoading(true)
            
            const result = await likeService.toggleVideoLike(videoId)

            if (result.success) {
                setIsLiked(result.data.isLiked)
                setLikeCount(result.data.likeCount)
                
                toast({
                    title: result.data.isLiked ? "Liked!" : "Unliked",
                    description: result.message,
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to update like",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const formatLikeCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    return (
        <Button
            variant={isLiked ? "default" : variant}
            size={size}
            onClick={handleToggleLike}
            disabled={isLoading}
            className={`doto-font-button ${className}`}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            )}
            {formatLikeCount(likeCount)}
        </Button>
    )
}

export default VideoLikeButton
