// src/components/pages/PlaylistsPage.jsx
import ComingSoon from "@/common/ComingSoon"
import { PlaySquare, Video, Clock, ThumbsUp } from "lucide-react"

const PlaylistsPage = () => {
    return (
        <ComingSoon
            feature="Playlists"
            description="Create and organize your favorite videos into custom playlists. Share your collections with others!"
            icon={PlaySquare}
            estimatedDate="Coming in April 2024"
            relatedFeatures={[
                { name: "My Videos", icon: Video, path: "/my-videos" },
                { name: "Watch Later", icon: Clock, path: "/watch-later" },
                { name: "Liked Videos", icon: ThumbsUp, path: "/liked-videos" }
            ]}
        />
    )
}

export default PlaylistsPage
