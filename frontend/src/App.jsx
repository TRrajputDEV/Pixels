// src/App.jsx
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

// coming soon features: 
import ExplorePage from "@/components/pages/ExplorePage"
import TrendingPage from "@/components/pages/TrendingPage"
import WatchLaterPage from "@/components/pages/WatchLaterPage"
import PlaylistsPage from "@/components/pages/PlaylistsPage"
import HistoryPage from "@/components/pages/HistoryPage"
import ComingSoon from "./common/ComingSoon"
import { Video } from "lucide-react"
import { ThumbsUp } from "lucide-react"


function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Auth Routes (no layout) */}
                        <Route path="/login" element={<LoginForm />} />

                        {/* Main App Routes (with layout) */}
                        <Route path="/*" element={
                            <AppLayout>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/watch/:videoId" element={<WatchVideo />} />
                                    <Route path="/search" element={<SearchResults />} />

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
                                    <Route path="/explore" element={<ExplorePage />} />
                                    <Route path="/trending" element={<TrendingPage />} />
                                    <Route path="/watch-later" element={<WatchLaterPage />} />
                                    <Route path="/playlists" element={<PlaylistsPage />} />
                                    <Route path="/history" element={<HistoryPage />} />
                                    <Route path="/liked-videos" element={<ComingSoon feature="Liked Videos" icon={() => <ThumbsUp />} />} />
                                    <Route path="/studio" element={<ComingSoon feature="Creator Studio" icon={() => <Video />} />} />
                                    <Route path="/settings" element={<ComingSoon feature="Settings" icon={() => <Settings />} />} />
                                    <Route path="/help" element={<ComingSoon feature="Help Center" icon={() => <HelpCircle />} />} />
                                    <Route path="/about" element={<ComingSoon feature="About Page" icon={() => <Info />} />} />
                                    <Route path="/channel/:username" element={<ChannelPage />} />
                                    <Route path="/c/:username" element={<ChannelPage />} />  {/* Alternative route */}
                                </Routes>
                            </AppLayout>
                        } />
                    </Routes>
                    <Toaster />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
