// src/components/pages/ExplorePage.jsx
import ComingSoon from "@/common/ComingSoon"
import { Compass, Home, TrendingUp, Video } from "lucide-react"

const ExplorePage = () => {
    return (
        <ComingSoon
            feature="Explore Page"
            description="Discover amazing content across different categories and topics. Browse by genre, mood, and trending topics!"
            icon={Compass}
            estimatedDate="Coming in Dec 2025 version V2"
            relatedFeatures={[
                { name: "Home", icon: Home, path: "/" },
                { name: "Trending", icon: TrendingUp, path: "/trending" },
                { name: "My Videos", icon: Video, path: "/my-videos" }
            ]}
        />
    )
}

export default ExplorePage
