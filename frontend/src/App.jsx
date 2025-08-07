// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './components/home/HomePage';
import Dashboard from './components/dashboard/Dashboard';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import VideoUpload from "@/components/upload/VideoUpload"
import WatchVideo from "@/components/watch/WatchVideo"
import SearchResults from "@/components/search/SearchResults"
import UserProfile from "@/components/profile/UserProfile"
import MyVideos from "@/components/videos/MyVideos"
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                    <Navbar />
                    <main className="pt-16">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/upload"
                                element={
                                    <ProtectedRoute>
                                        <VideoUpload />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/watch/:videoId" element={<WatchVideo />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <UserProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-videos"
                                element={
                                    <ProtectedRoute>
                                        <MyVideos />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
