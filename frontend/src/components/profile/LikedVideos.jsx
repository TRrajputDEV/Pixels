// src/components/profile/LikedVideos.jsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import VideoGrid from "@/components/home/VideoGrid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, AlertCircle } from "lucide-react"
import likeService from "@/services/LikeService"

const LikedVideos = () => {
    const { user, isAuthenticated } = useAuth()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchLikedVideos = async () => {
            if (!isAuthenticated) {
                setError("Please log in to view liked videos")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const result = await likeService.getLikedVideos({
                    page: 1,
                    limit: 50
                })

                if (result.success) {
                    setVideos(result.data.docs || result.data || [])
                } else {
                    setError(result.error || "Failed to load liked videos")
                }
            } catch (err) {
                setError("An error occurred while loading videos")
            } finally {
                setLoading(false)
            }
        }

        fetchLikedVideos()
    }, [isAuthenticated])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please sign in to view your liked videos.</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="h-6 w-6 text-red-500" />
                        <h1 className="text-3xl font-bold doto-font-heading">
                            Liked Videos
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Videos you've liked on Pixels
                    </p>
                </div>

                <VideoGrid videos={videos} loading={loading} />

                {!loading && videos.length === 0 && (
                    <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">No liked videos yet</p>
                        <p className="text-muted-foreground">
                            Start exploring and like videos you enjoy!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LikedVideos
