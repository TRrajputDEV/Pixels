// src/components/layout/AppLayout.jsx - FIXED VERSION with proper auth handling
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import MobileSidebar from "./MobileSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    PanelLeftClose, 
    PanelLeftOpen,
    Search,
    Bell,
    User,
    Upload,
    Settings,
    LogOut,
    Sun,
    Moon,
    Play,
    X
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import LoginModal from "@/components/auth/LoginModal"
import RegisterModal from "@/components/auth/RegisterModal"

const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    
    // FIXED: Get auth state properly with loading state
    const { user, isAuthenticated, logout, isLoading } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    console.log("Auth Debug:", { user, isAuthenticated, isLoading }) // Debug log

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (mobile) {
                setSidebarOpen(false)
            } else {
                setSidebarOpen(true)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setMobileSearchOpen(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-full items-center px-4">
                    {/* Left Section - Menu & Logo */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Mobile Hamburger */}
                        <div className="lg:hidden">
                            <MobileSidebar />
                        </div>

                        {/* Desktop Sidebar Toggle */}
                        <div className="hidden lg:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <PanelLeftClose className="h-5 w-5" />
                                ) : (
                                    <PanelLeftOpen className="h-5 w-5" />
                                )}
                            </Button>
                        </div>

                        {/* Logo */}
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            {/*  */}
                            <span className="doto-font-heading text-xl font-extrabold">
                                Pixels
                            </span>
                        </div>
                    </div>

                    {/* Center Section - Search */}
                    <div className="flex-1 max-w-2xl mx-auto px-4">
                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search videos, channels, creators..."
                                    className="w-full pl-10 pr-4"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>

                        {/* Mobile Search Button */}
                        <div className="md:hidden flex justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Section - User Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* FIXED: Proper conditional rendering based on auth state */}
                        {!isLoading ? (
                            isAuthenticated && user ? (
                                <>
                                    {/* Upload Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigate('/upload')}
                                        className="hidden sm:flex"
                                    >
                                        <Upload className="h-5 w-5" />
                                    </Button>

                                    {/* Notifications */}
                                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                                        <Bell className="h-5 w-5" />
                                    </Button>

                                    {/* User Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-center gap-2 h-10">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage 
                                                        src={user?.avatar} 
                                                        alt={user?.fullname || user?.username} 
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {user?.fullname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="hidden lg:inline text-sm font-medium max-w-24 truncate">
                                                    {user?.fullname || user?.username || "User"}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {user?.fullname || user?.username || "User"}
                                                    </p>
                                                    <p className="text-xs leading-none text-muted-foreground">
                                                        {user?.email || ""}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                                                <User className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                Profile Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Sign out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowLoginModal(true)}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setShowRegisterModal(true)}
                                        className="hidden sm:flex"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )
                        ) : (
                            /* Loading state */
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                                <div className="w-16 h-6 bg-muted animate-pulse rounded hidden lg:block" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar (Expandable) */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t bg-background p-4">
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="search"
                                placeholder="Search videos..."
                                className="pl-10 pr-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setMobileSearchOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </header>

            {/* Layout Container */}
            <div className="flex pt-16">
                {/* Desktop Sidebar */}
                {!isMobile && sidebarOpen && (
                    <aside className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] z-40">
                        <Sidebar />
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 min-w-0 transition-all duration-300 ${
                    !isMobile && sidebarOpen ? 'ml-80' : 'ml-0'
                }`}>
                    <div className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </div>
                </main>
            </div>

            {/* Auth Modals */}
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

export default AppLayout
