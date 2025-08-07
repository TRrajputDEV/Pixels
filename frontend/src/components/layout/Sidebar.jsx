// src/components/layout/Sidebar.jsx
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Home,
    Compass,
    Video,
    Clock,
    ThumbsUp,
    PlaySquare,
    Users,
    Rss,
    BarChart3,
    Settings,
    Upload,
    User,
    TrendingUp,
    History,
    Library,
    Bookmark,
    HelpCircle,
    Info,
    ChevronRight,
    Play
} from "lucide-react"

const Sidebar = ({ isOpen, className = "" }) => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Navigation items configuration
    const mainNavItems = [
        {
            title: "Home",
            icon: Home,
            href: "/",
            description: "Discover trending videos"
        },
        {
            title: "Explore",
            icon: Compass,
            href: "/explore",
            description: "Browse all categories"
        },
        {
            title: "Trending",
            icon: TrendingUp,
            href: "/trending",
            description: "What's popular now"
        }
    ]

    const userNavItems = isAuthenticated ? [
        {
            title: "Your Channel",
            icon: User,
            href: "/dashboard",
            description: "Manage your content",
            badge: "Dashboard"
        },
        {
            title: "My Videos",
            icon: Video,
            href: "/my-videos",
            description: "Manage uploads"
        },
        {
            title: "Watch Later",
            icon: Clock,
            href: "/watch-later",
            description: "Saved for later"
        },
        {
            title: "Liked Videos",
            icon: ThumbsUp,
            href: "/liked-videos",
            description: "Videos you liked"
        },
        {
            title: "Playlists",
            icon: PlaySquare,
            href: "/playlists",
            description: "Your collections"
        },
        {
            title: "History",
            icon: History,
            href: "/history",
            description: "Watch history"
        }
    ] : []

    const subscriptionNavItems = isAuthenticated ? [
        {
            title: "Subscriptions",
            icon: Users,
            href: "/subscriptions",
            description: "Channels you follow"
        },
        {
            title: "Feed",
            icon: Rss,
            href: "/feed",
            description: "Latest from subscribed channels",
            badge: "New"
        }
    ] : []

    const creatorNavItems = isAuthenticated ? [
        {
            title: "Upload Video",
            icon: Upload,
            href: "/upload",
            description: "Share your content",
            highlight: true
        },
        {
            title: "Analytics",
            icon: BarChart3,
            href: "/analytics",
            description: "Channel insights"
        },
        {
            title: "Studio",
            icon: Library,
            href: "/studio",
            description: "Creator tools"
        }
    ] : []

    const settingsNavItems = [
        {
            title: "Settings",
            icon: Settings,
            href: "/settings",
            description: "App preferences"
        },
        {
            title: "Help",
            icon: HelpCircle,
            href: "/help",
            description: "Get support"
        },
        {
            title: "About",
            icon: Info,
            href: "/about",
            description: "About Pixels"
        }
    ]

    const isActiveRoute = (href) => {
        if (href === "/") {
            return location.pathname === "/"
        }
        return location.pathname.startsWith(href)
    }

    const NavItem = ({ item, isActive }) => (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
                item.highlight ? "bg-primary/10 hover:bg-primary/20 border border-primary/20" : ""
            } ${isActive ? "bg-secondary" : ""}`}
            onClick={() => navigate(item.href)}
        >
            <item.icon className={`h-5 w-5 mr-3 ${
                item.highlight ? "text-primary" : ""
            } ${isActive ? "text-primary" : ""}`} />
            <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                        item.highlight ? "text-primary" : ""
                    }`}>
                        {item.title}
                    </span>
                    {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                            {item.badge}
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
    )

    const SectionTitle = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
            <Icon className="h-4 w-4" />
            {title}
        </div>
    )

    return (
        <div className={`flex flex-col h-full bg-background border-r ${className}`}>
            {/* Sidebar Header */}
            

            <ScrollArea className="flex-1 px-2 py-4">
                <div className="space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        {mainNavItems.map((item) => (
                            <NavItem
                                key={item.href}
                                item={item}
                                isActive={isActiveRoute(item.href)}
                            />
                        ))}
                    </div>

                    {/* User Section - Only show if authenticated */}
                    {isAuthenticated && userNavItems.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <SectionTitle title="Library" icon={Library} />
                                <div className="space-y-1">
                                    {userNavItems.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            item={item}
                                            isActive={isActiveRoute(item.href)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Subscriptions Section */}
                    {isAuthenticated && subscriptionNavItems.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <SectionTitle title="Subscriptions" icon={Users} />
                                <div className="space-y-1">
                                    {subscriptionNavItems.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            item={item}
                                            isActive={isActiveRoute(item.href)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Creator Tools Section */}
                    {isAuthenticated && creatorNavItems.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <SectionTitle title="Creator Studio" icon={Video} />
                                <div className="space-y-1">
                                    {creatorNavItems.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            item={item}
                                            isActive={isActiveRoute(item.href)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* User Profile Section */}
                    {isAuthenticated && (
                        <>
                            <Separator />
                            <div className="p-3">
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage 
                                            src={user?.avatar} 
                                            alt={user?.fullname} 
                                        />
                                        <AvatarFallback>
                                            {user?.fullname?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {user?.fullname || "User"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            @{user?.username || "username"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => navigate('/profile')}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Settings Section */}
                    <Separator />
                    <div>
                        <SectionTitle title="More" icon={Settings} />
                        <div className="space-y-1">
                            {settingsNavItems.map((item) => (
                                <NavItem
                                    key={item.href}
                                    item={item}
                                    isActive={isActiveRoute(item.href)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t">
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        © 2024 Pixels Platform
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Made with ❤️ for creators
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
