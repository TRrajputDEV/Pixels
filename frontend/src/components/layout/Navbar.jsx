// src/components/layout/Navbar.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import LoginModal from "@/components/auth/LoginModal"
import RegisterModal from "@/components/auth/RegisterModal"

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()

    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return (
        <>
            {/* ───────────────────────────────── NAVBAR ───────────────────────────────── */}
            <nav className="fixed inset-x-0 top-0 z-50 border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
                    {/* logo */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-lg font-bold tracking-tight"
                    >
                        Loop
                    </button>

                    {/* search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Search videos..."
                                className="pl-4 pr-10"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {/* simple search icon (svg) */}
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* actions */}
                    {!isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowLoginModal(true)}
                            >
                                Sign in
                            </Button>
                            <Button onClick={() => setShowRegisterModal(true)}>
                                Sign up
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* upload */}
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => navigate("/upload")}
                                title="Upload"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </Button>

                            {/* avatar + dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarImage src={user?.avatar} alt={user?.fullname} />
                                        <AvatarFallback>
                                            {user?.fullname?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onSelect={() => navigate("/dashboard")}>
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => navigate("/profile")}>
                                        Your channel
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={handleLogout}>
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </nav>

            {/* dark-mode toggle (demo) */}
            

            {/* auth modals */}
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
