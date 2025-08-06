// src/components/ui/CommentLikeButton.jsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import likeService from "@/services/LikeService"

const CommentLikeButton = ({ 
    commentId, 
    initialLikeCount = 0, 
    initialIsLiked = false 
}) => {
    const { isAuthenticated } = useAuth()
    const { toast } = useToast()

    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLiked(initialIsLiked)
        setLikeCount(initialLikeCount)
    }, [initialIsLiked, initialLikeCount])

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "You must be logged in to like comments",
                variant: "destructive",
            })
            return
        }

        try {
            setIsLoading(true)
            
            const result = await likeService.toggleCommentLike(commentId)

            if (result.success) {
                setIsLiked(result.data.isLiked)
                setLikeCount(result.data.likeCount)
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

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            disabled={isLoading}
            className={`h-8 px-2 text-xs ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
        >
            {isLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            )}
            {likeCount > 0 && likeCount}
        </Button>
    )
}

export default CommentLikeButton
