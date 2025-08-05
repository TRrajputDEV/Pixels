// src/components/layout/Navbar.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    Search, 
    Upload, 
    Moon, 
    Sun, 
    Film 
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
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <>
            <nav className="fixed inset-x-0 top-0 z-50  bg-background text-foreground transition-colors duration-300">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 text-lg font-bold tracking-tight"
                    >
                        {/* <Film className="h-6 w-6 text-primary" /> */}
                        <span className="doto-font-heading text-2xl font-extrabold">Pixels</span>
                    </Link>

                    {/* Search */}
                    <form 
                        onSubmit={handleSearch}
                        className="flex-1 max-w-2xl doto-font font-extrabold"
                    >
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="watch Pixels moving...."
                                className="pl-10 pr-4 py-5 text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Search className="h-4 w-4" />
                            </span>
                        </div>
                    </form>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle - Always visible */}
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
                                    className="doto-font-button "
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Sign in
                                </Button>
                                <Button
                                className="doto-font-button "
                                onClick={() => setShowRegisterModal(true)}>
                                    Sign up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="doto-font-button "
                                    onClick={() => navigate("/upload")}
                                >
                                    <Upload className="h-5 w-5" />
                                </Button>
                                
                                <div className="flex items-center gap-2 ml-2">
                                    <span className="text-sm doto-font  hidden sm:block">
                                        Hi, {user?.fullname || user?.username}
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="doto-font-button "
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
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