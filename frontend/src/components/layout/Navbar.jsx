// src/components/layout/Navbar.jsx
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Search,
    Upload,
    Moon,
    Sun,
    Film,
    LayoutDashboard,
    User,
    LogOut,
    Menu,
    X
} from "lucide-react"
import LoginModal from "@/components/auth/LoginModal"
import RegisterModal from "@/components/auth/RegisterModal"
import { useTheme } from "@/context/ThemeContext"

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        setMobileMenuOpen(false)
        navigate("/")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setMobileSearchOpen(false)
        }
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    const handleNavigation = (path) => {
        navigate(path)
        setMobileMenuOpen(false)
    }

    return (
        <>
            <nav className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    
                    {/* Mobile Menu Button & Logo */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu trigger */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80">
                                <SheetHeader>
                                    <SheetTitle className="text-left">
                                        <Link
                                            to="/"
                                            className="flex items-center gap-2 text-lg font-bold tracking-tight"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className="doto-font-heading text-2xl font-extrabold">Pixels</span>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Mobile Menu Content */}
                                <div className="mt-8 space-y-6">
                                    {/* Mobile Search */}
                                    <form onSubmit={handleSearch} className="space-y-2">
                                        <div className="relative">
                                            <Input
                                                type="search"
                                                placeholder="Search videos..."
                                                className="pl-10 pr-4"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                    </form>

                                    {/* Theme Toggle */}
                                    <Button
                                        variant="ghost"
                                        onClick={toggleTheme}
                                        className="w-full justify-start"
                                    >
                                        {theme === "dark" ? (
                                            <Sun className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Moon className="mr-2 h-4 w-4" />
                                        )}
                                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                    </Button>

                                    {/* Auth Buttons or User Menu */}
                                    {!isAuthenticated ? (
                                        <div className="space-y-3">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => {
                                                    setShowLoginModal(true)
                                                    setMobileMenuOpen(false)
                                                }}
                                            >
                                                Sign in
                                            </Button>
                                            <Button
                                                className="w-full"
                                                onClick={() => {
                                                    setShowRegisterModal(true)
                                                    setMobileMenuOpen(false)
                                                }}
                                            >
                                                Sign up
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={user?.avatar}
                                                        alt={user?.fullname || user?.username}
                                                    />
                                                    <AvatarFallback>
                                                        {user?.fullname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {user?.fullname || user?.username || "User"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {user?.email || ""}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Navigation Items */}
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => handleNavigation("/upload")}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => handleNavigation("/dashboard")}
                                            >
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => handleNavigation("/profile")}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Sign out
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-lg font-bold tracking-tight"
                        >
                            <span className="doto-font-heading text-xl sm:text-2xl font-extrabold">Pixels</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex flex-1 max-w-2xl mx-8"
                    >
                        <div className="relative w-full">
                            <Input
                                type="search"
                                placeholder="watch Pixels moving...."
                                className="pl-10 pr-4 py-5 text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </form>

                    {/* Mobile Search Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Theme Toggle */}
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {!isAuthenticated ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="doto-font-button"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    className="doto-font-button"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Sign up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="icon"
                                    variant={isActive("/upload") ? "secondary" : "ghost"}
                                    className="doto-font-button"
                                    onClick={() => navigate("/upload")}
                                >
                                    <Upload className="h-5 w-5" />
                                </Button>

                                {/* Desktop User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer ml-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user?.avatar}
                                                    alt={user?.fullname || user?.username}
                                                />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {user?.fullname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
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
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                                            <User className="mr-2 h-4 w-4" />
                                            Your Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
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
            </nav>

            {/* Auth modals */}
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
        </>
    )
}

export default Navbar
