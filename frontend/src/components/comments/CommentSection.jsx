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
import LoginModal from "@/components/auth/LoginModal"
import RegisterModal from "@/components/auth/RegisterModal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    AlertCircle,
    MessageCircle,
    Send,
    MoreHorizontal,
    Edit2,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronUp
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
    
    // Auth modals state
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    
    // Collapsible state
    const [isCommentsOpen, setIsCommentsOpen] = useState(true)
    const [visibleComments, setVisibleComments] = useState(5) // Show 5 comments initially
    const [showLoadMore, setShowLoadMore] = useState(false)

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
                    const commentsData = result.data.docs || result.data || []
                    setComments(commentsData)
                    setShowLoadMore(commentsData.length > 5)
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
                // Expand comments section and show the new comment
                setIsCommentsOpen(true)
                setVisibleComments(Math.max(visibleComments, 1))
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

    const handleLoadMore = () => {
        setVisibleComments(prev => Math.min(prev + 10, comments.length))
    }

    const handleShowLess = () => {
        setVisibleComments(5)
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
            {/* Comments Header - Collapsible Trigger */}
            <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <h3 className="text-lg font-semibold doto-font-heading">
                                {comments.length} Comments
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {isCommentsOpen ? (
                                <ChevronUp className="h-5 w-5" />
                            ) : (
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-6 mt-4">
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
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2 doto-font-heading">Join the Conversation</h3>
                                <p className="text-muted-foreground mb-4">
                                    Sign in to leave comments and interact with the Pixels community
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <Button 
                                        onClick={() => setShowLoginModal(true)}
                                        className="doto-font-button"
                                    >
                                        Sign In
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => setShowRegisterModal(true)}
                                        className="doto-font-button"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
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
                            <>
                                {/* Render visible comments */}
                                {comments.slice(0, visibleComments).map((comment) => (
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
                                                                    initialLikeCount={0}
                                                                    initialIsLiked={false}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Load More/Show Less Controls */}
                                {comments.length > 5 && (
                                    <div className="flex justify-center gap-2 pt-4">
                                        {visibleComments < comments.length && (
                                            <Button
                                                variant="outline"
                                                onClick={handleLoadMore}
                                                className="doto-font-button"
                                            >
                                                Load More Comments ({comments.length - visibleComments} remaining)
                                            </Button>
                                        )}
                                        
                                        {visibleComments > 5 && (
                                            <Button
                                                variant="ghost"
                                                onClick={handleShowLess}
                                                className="doto-font-button text-muted-foreground"
                                            >
                                                Show Less
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Auth modals */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                }}
            />
        </div>
    )
}

export default CommentSection
