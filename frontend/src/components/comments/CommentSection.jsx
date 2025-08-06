// src/components/comments/CommentSection.jsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CommentLikeButton from "@/components/ui/CommentLikeButton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertCircle,
    MessageCircle,
    Send,
    MoreHorizontal,
    Edit2,
    Trash2,
    Loader2
} from "lucide-react"
import commentService from "@/services/CommentService"
import { useToast } from "@/hooks/use-toast"

const CommentSection = ({ videoId }) => {
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    // State
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [editingComment, setEditingComment] = useState(null)
    const [editContent, setEditContent] = useState("")
    const [error, setError] = useState(null)

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            if (!videoId) return

            try {
                setLoading(true)
                setError(null)

                const result = await commentService.getVideoComments(videoId, {
                    page: 1,
                    limit: 50
                })

                if (result.success) {
                    setComments(result.data.docs || result.data || [])
                } else {
                    setError(result.error || "Failed to load comments")
                }
            } catch (err) {
                setError("An error occurred while loading comments")
                console.error("Comments fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchComments()
    }, [videoId])

    // Add new comment
    const handleAddComment = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "You must be logged in to comment",
                variant: "destructive",
            })
            return
        }

        if (!newComment.trim()) {
            toast({
                title: "Empty Comment",
                description: "Please enter a comment before posting",
                variant: "destructive",
            })
            return
        }

        try {
            setSubmitting(true)
            const result = await commentService.addComment(videoId, {
                content: newComment.trim()
            })

            if (result.success) {
                setComments(prev => [result.data, ...prev])
                setNewComment("")
                toast({
                    title: "Success",
                    description: "Comment posted successfully",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to post comment",
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
            setSubmitting(false)
        }
    }

    // Edit comment
    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) {
            toast({
                title: "Empty Comment",
                description: "Comment cannot be empty",
                variant: "destructive",
            })
            return
        }

        try {
            const result = await commentService.updateComment(commentId, {
                content: editContent.trim()
            })

            if (result.success) {
                setComments(prev =>
                    prev.map(comment =>
                        comment._id === commentId
                            ? { ...comment, content: editContent.trim() }
                            : comment
                    )
                )
                setEditingComment(null)
                setEditContent("")
                toast({
                    title: "Success",
                    description: "Comment updated successfully",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to update comment",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            })
        }
    }

    // Delete comment
    const handleDeleteComment = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return

        try {
            const result = await commentService.deleteComment(commentId)

            if (result.success) {
                setComments(prev => prev.filter(comment => comment._id !== commentId))
                toast({
                    title: "Success",
                    description: "Comment deleted successfully",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to delete comment",
                    variant: "destructive",
                })
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            })
        }
    }

    const formatTimeAgo = (date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

        if (diffInSeconds < 60) return "Just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return new Date(date).toLocaleDateString()
    }

    const canEditOrDelete = (comment) => {
        return user && (comment.owner._id === user._id)
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            {/* Comments Header */}
            <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold doto-font-heading">
                    {comments.length} Comments
                </h3>
            </div>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={user?.avatar}
                                    alt={user?.fullname || user?.username}
                                />
                                <AvatarFallback>
                                    {(user?.fullname || user?.username)?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    placeholder="Add a public comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[80px] doto-font resize-none"
                                    disabled={submitting}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setNewComment("")}
                                        disabled={submitting || !newComment.trim()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddComment}
                                        disabled={submitting || !newComment.trim()}
                                        className="doto-font-button"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please sign in to leave a comment.
                    </AlertDescription>
                </Alert>
            )}

            <Separator />

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">No comments yet</p>
                        <p className="text-muted-foreground">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment._id} className="border-l-2 border-l-primary/20">
                            <CardContent className="pt-4">
                                <div className="flex gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={comment.owner?.avatar}
                                            alt={comment.owner?.fullname || comment.owner?.username}
                                        />
                                        <AvatarFallback>
                                            {(comment.owner?.fullname || comment.owner?.username)?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm doto-font">
                                                    {comment.owner?.fullname || comment.owner?.username}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTimeAgo(comment.createdAt)}
                                                </p>
                                            </div>
                                            {canEditOrDelete(comment) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditingComment(comment._id)
                                                                setEditContent(comment.content)
                                                            }}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                        {editingComment === comment._id ? (
                                            <div className="mt-3 space-y-3">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="min-h-[60px] doto-font resize-none"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingComment(null)
                                                            setEditContent("")
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEditComment(comment._id)}
                                                        disabled={!editContent.trim()}
                                                        className="doto-font-button"
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm leading-relaxed doto-font">
                                                    {comment.content}
                                                </p>

                                                {/* Comment Actions - Like Button */}
                                                <div className="flex items-center gap-2 pt-1">
                                                    <CommentLikeButton
                                                        commentId={comment._id}
                                                        initialLikeCount={0} // Will be updated when you add like counts to backend
                                                        initialIsLiked={false} // Will be updated when you add user like status
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

        </div>
    )
}

export default CommentSection
