// src/components/pages/TrendingPage.jsx
import ComingSoon from "@/common/ComingSoon"
import { TrendingUp, Home, Compass, Video } from "lucide-react"

const TrendingPage = () => {
    return (
        <ComingSoon
            feature="Trending Videos"
            description="See what's hot right now! Discover the most popular videos, trending topics, and viral content on Pixels."
            icon={TrendingUp}
            estimatedDate="Coming in Dec 2025 version V2"
            relatedFeatures={[
                { name: "Home", icon: Home, path: "/" },
                { name: "Explore", icon: Compass, path: "/explore" },
                { name: "My Videos", icon: Video, path: "/my-videos" }
            ]}
        />
    )
}

export default TrendingPage
