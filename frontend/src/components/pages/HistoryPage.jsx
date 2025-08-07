// src/components/pages/HistoryPage.jsx
import ComingSoon from "@/common/ComingSoon"
import { History, Video, Clock, PlaySquare } from "lucide-react"

const HistoryPage = () => {
    return (
        <ComingSoon
            feature="Watch History"
            description="Keep track of all the videos you've watched. Easily find that video you saw last week!"
            icon={History}
            estimatedDate="Coming in March 2024"
            relatedFeatures={[
                { name: "My Videos", icon: Video, path: "/my-videos" },
                { name: "Watch Later", icon: Clock, path: "/watch-later" },
                { name: "Playlists", icon: PlaySquare, path: "/playlists" }
            ]}
        />
    )
}

export default HistoryPage
