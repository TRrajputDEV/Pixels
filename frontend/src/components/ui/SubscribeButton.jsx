// src/components/ui/SubscribeButton.jsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Bell, BellRing, Loader2, Users } from "lucide-react"
import subscriptionService from "@/services/SubscriptionService"

const SubscribeButton = ({ 
    channelId, 
    channelName,
    initialSubscriberCount = 0,
    size = "default",
    variant = "default",
    showCount = true,
    className = "" 
}) => {
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()
    
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(initialSubscriberCount)
    const [loading, setLoading] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    // Check subscription status on mount
    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            if (!isAuthenticated || !channelId || channelId === user?._id) {
                setCheckingStatus(false)
                return
            }

            try {
                setCheckingStatus(true)
                const result = await subscriptionService.getSubscribedChannels(user._id, {
                    page: 1,
                    limit: 100 // Get enough to check if channel is in list
                })

                if (result.success) {
                    const isChannelSubscribed = result.data.subscribedChannels.some(
                        sub => sub.channelInfo._id === channelId
                    )
                    setIsSubscribed(isChannelSubscribed)
                }
            } catch (error) {
                console.error("Error checking subscription status:", error)
            } finally {
                setCheckingStatus(false)
            }
        }

        checkSubscriptionStatus()
    }, [channelId, user?._id, isAuthenticated])

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please sign in to subscribe to channels",
                variant: "destructive",
            })
            return
        }

        if (channelId === user?._id) {
            toast({
                title: "Cannot Subscribe",
                description: "You cannot subscribe to your own channel",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)
            const result = await subscriptionService.toggleSubscription(channelId)

            if (result.success) {
                const wasSubscribed = isSubscribed
                setIsSubscribed(result.data.subscribed)
                
                // Update subscriber count optimistically
                setSubscriberCount(prev => 
                    result.data.subscribed ? prev + 1 : Math.max(0, prev - 1)
                )

                toast({
                    title: result.data.subscribed ? "Subscribed! 🔔" : "Unsubscribed",
                    description: result.data.subscribed 
                        ? `You're now subscribed to ${channelName || 'this channel'}`
                        : `Unsubscribed from ${channelName || 'this channel'}`,
                })
            } else {
                toast({
                    title: "Subscription Failed",
                    description: result.error || "Unable to update subscription",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Don't show button for own channel
    if (channelId === user?._id) {
        return null
    }

    // Don't show if not authenticated
    if (!isAuthenticated) {
        return (
            <Button
                variant="outline"
                size={size}
                className={className}
                onClick={handleSubscribe}
            >
                <Bell className="mr-2 h-4 w-4" />
                Subscribe
                {showCount && subscriberCount > 0 && (
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                        {formatNumber(subscriberCount)}
                    </span>
                )}
            </Button>
        )
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    if (checkingStatus) {
        return (
            <Button
                variant="outline"
                size={size}
                className={className}
                disabled
            >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </Button>
        )
    }

    return (
        <Button
            variant={isSubscribed ? "secondary" : variant}
            size={size}
            className={`${className} transition-all duration-200 ${
                isSubscribed ? "hover:bg-destructive hover:text-destructive-foreground" : ""
            }`}
            onClick={handleSubscribe}
            disabled={loading}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
                </>
            ) : (
                <>
                    {isSubscribed ? (
                        <>
                            <BellRing className="mr-2 h-4 w-4" />
                            <span className="group-hover:hidden">Subscribed</span>
                            <span className="hidden group-hover:inline">Unsubscribe</span>
                        </>
                    ) : (
                        <>
                            <Bell className="mr-2 h-4 w-4" />
                            Subscribe
                        </>
                    )}
                </>
            )}
            {showCount && subscriberCount > 0 && (
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                    {formatNumber(subscriberCount)}
                </span>
            )}
        </Button>
    )
}

export default SubscribeButton
