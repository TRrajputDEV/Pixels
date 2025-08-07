// src/components/pages/WatchLaterPage.jsx
import ComingSoon from "@/common/ComingSoon"
import { Clock, Video, ThumbsUp, PlaySquare } from "lucide-react"

const WatchLaterPage = () => {
    return (
        <ComingSoon
            feature="Watch Later"
            description="Save videos to watch when you have time. Build your personal queue and never miss great content!"
            icon={Clock}
            estimatedDate="Coming in Dec 2025 version V2"
            relatedFeatures={[
                { name: "My Videos", icon: Video, path: "/my-videos" },
                { name: "Liked Videos", icon: ThumbsUp, path: "/liked-videos" },
                { name: "Playlists", icon: PlaySquare, path: "/playlists" }
            ]}
        />
    )
}

export default WatchLaterPage
