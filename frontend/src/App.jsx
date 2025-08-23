// src/App.jsx - Complete Updated Version with Error Handling
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { Toaster } from "@/components/ui/toaster"
import AppLayout from "@/components/layout/AppLayout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

// Import all your page components
import HomePage from "@/components/home/HomePage"
import WatchVideo from "@/components/watch/WatchVideo"
import LoginForm from "@/components/auth/LoginForm"
import Dashboard from "@/components/dashboard/Dashboard"
import UserProfile from "@/components/profile/UserProfile"
import MyVideos from "@/components/videos/MyVideos"
import EditVideo from "@/components/videos/EditVideo"
import Analytics from "@/components/analytics/Analytics"
import MySubscriptions from "@/components/subscriptions/MySubscriptions"
import SubscriptionFeed from "@/components/subscriptions/SubscriptionFeed"
import VideoUpload from "@/components/upload/VideoUpload"
import SearchResults from "@/components/search/SearchResults"
import ChannelPage from "@/components/channel/ChannelPage"

// Coming soon features
import ExplorePage from "@/components/pages/ExplorePage"
import TrendingPage from "@/components/pages/TrendingPage"
import WatchLaterPage from "@/components/pages/WatchLaterPage"
import PlaylistsPage from "@/components/pages/PlaylistsPage"
import HistoryPage from "@/components/pages/HistoryPage"
import ComingSoon from "@/common/ComingSoon"
import SettingsPage from '@/components/pages/SettingsPage';

// Icons for coming soon pages
import { 
    Video, 
    ThumbsUp, 
    Settings, 
    HelpCircle, 
    Info 
} from "lucide-react"

// Error handling components
import ErrorBoundary from "@/common/ErrorBoundary"
import NetworkStatus from "@/common/NetworkStatus"
import LikedVideos from "./components/profile/LikedVideos"

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <NetworkStatus />
                        <Routes>
                            {/* Auth Routes (no layout) */}
                            <Route path="/login" element={<LoginForm />} />

                            {/* Main App Routes (with layout) */}
                            <Route path="/*" element={
                                <AppLayout>
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/watch/:videoId" element={<WatchVideo />} />
                                        <Route path="/search" element={<SearchResults />} />
                                        <Route path="/channel/:username" element={<ChannelPage />} />
                                        <Route path="/c/:username" element={<ChannelPage />} />

                                        {/* Coming Soon Public Routes */}
                                        <Route path="/explore" element={<ExplorePage />} />
                                        <Route path="/trending" element={<TrendingPage />} />

                                        {/* Protected Routes */}
                                        <Route path="/dashboard" element={
                                            <ProtectedRoute><Dashboard /></ProtectedRoute>
                                        } />
                                        <Route path="/profile" element={
                                            <ProtectedRoute><UserProfile /></ProtectedRoute>
                                        } />
                                        <Route path="/my-videos" element={
                                            <ProtectedRoute><MyVideos /></ProtectedRoute>
                                        } />
                                        <Route path="/edit-video/:videoId" element={
                                            <ProtectedRoute><EditVideo /></ProtectedRoute>
                                        } />
                                        <Route path="/analytics" element={
                                            <ProtectedRoute><Analytics /></ProtectedRoute>
                                        } />
                                        <Route path="/subscriptions" element={
                                            <ProtectedRoute><MySubscriptions /></ProtectedRoute>
                                        } />
                                        <Route path="/feed" element={
                                            <ProtectedRoute><SubscriptionFeed /></ProtectedRoute>
                                        } />
                                        <Route path="/upload" element={
                                            <ProtectedRoute><VideoUpload /></ProtectedRoute>
                                        } />

                                        {/* Protected Coming Soon Routes */}
                                        <Route path="/watch-later" element={
                                            <ProtectedRoute><WatchLaterPage /></ProtectedRoute>
                                        } />
                                        <Route path="/playlists" element={
                                            <ProtectedRoute><PlaylistsPage /></ProtectedRoute>
                                        } />
                                        <Route path="/history" element={
                                            <ProtectedRoute><HistoryPage /></ProtectedRoute>
                                        } />
                                        <Route path="/liked-videos" element={
                                            <ProtectedRoute>
                                                <LikedVideos/>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/studio" element={
                                            <ProtectedRoute>
                                                <ComingSoon 
                                                    feature="Creator Studio" 
                                                    description="Advanced creator tools for managing your channel and content professionally!"
                                                    icon={Video}
                                                    estimatedDate="Coming in March 2024"
                                                />
                                            </ProtectedRoute>
                                        } />

                                        {/* Settings & Info Routes */}
                                        <Route path="/settings" element={
                                            <ProtectedRoute>
                                                <SettingsPage/>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/help" element={
                                            <ComingSoon 
                                                feature="Help Center" 
                                                description="Get support, tutorials, and answers to frequently asked questions!"
                                                icon={HelpCircle}
                                                estimatedDate="Coming in January 2024"
                                            />
                                        } />
                                        <Route path="/about" element={
                                            <ComingSoon 
                                                feature="About Page" 
                                                description="Learn more about Pixels, our mission, and the team behind the platform!"
                                                icon={Info}
                                                estimatedDate="Coming Soon"
                                            />
                                        } />

                                        {/* 404 Route */}
                                        <Route path="*" element={
                                            <ComingSoon 
                                                feature="Page Not Found" 
                                                description="The page you're looking for doesn't exist. Let's get you back to the good stuff!"
                                                icon={Info}
                                                estimatedDate="Available Now"
                                            />
                                        } />
                                    </Routes>
                                </AppLayout>
                            } />
                        </Routes>
                        <Toaster />
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
