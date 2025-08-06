// src/components/search/SearchSuggestions.jsx
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Clock } from "lucide-react"
import videoService from "@/services/VideoService"

const SearchSuggestions = ({ query, onSelect, onHide }) => {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const cardRef = useRef(null)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.length < 2) {
                setSuggestions([])
                return
            }

            setLoading(true)
            try {
                const result = await videoService.getSearchSuggestions(query)
                if (result.success) {
                    const videos = result.data.docs || result.data || []
                    setSuggestions(videos.slice(0, 5))
                }
            } catch (err) {
                console.error("Suggestions error:", err)
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(debounceTimer)
    }, [query])

    if (!query || suggestions.length === 0) return null

    return (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50" ref={cardRef}>
            <CardContent className="p-2">
                {suggestions.map((video) => (
                    <Button
                        key={video._id}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => onSelect(video.title)}
                    >
                        <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                        <div className="text-left">
                            <p className="font-medium">{video.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {video.owner?.fullname} • {video.view} views
                            </p>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}

export default SearchSuggestions
