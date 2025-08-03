// src/components/dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import ProfileCard from './ProfileCard';
import UserStats from './UserStats';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 border-b border-emerald-900/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-emerald-300">
                        Welcome back, <span className="text-amber-300">{user?.fullname}</span>!
                    </h1>
                    <p className="mt-1 text-emerald-400/80">
                        Here's what's happening with your account today
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <ProfileCard user={user} />
                        </div>

                        {/* Main Dashboard Content */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {/* User Stats */}
                                <UserStats user={user} />

                                {/* Analytics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Recent Activity */}
                                    <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden">
                                        <div className="px-5 py-6 sm:p-6">
                                            <div className="flex justify-between items-center mb-5">
                                                <h3 className="text-lg font-bold text-emerald-300">
                                                    Recent Activity
                                                </h3>
                                                <button className="text-amber-300 hover:text-amber-200 text-sm font-medium">
                                                    View All
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { 
                                                        action: 'Uploaded', 
                                                        title: 'Mountain Hiking Adventure', 
                                                        time: '2 hours ago',
                                                        icon: '📤'
                                                    },
                                                    { 
                                                        action: 'Commented on', 
                                                        title: 'Tech Gadgets Review', 
                                                        time: '4 hours ago',
                                                        icon: '💬'
                                                    },
                                                    { 
                                                        action: 'Liked', 
                                                        title: 'Cooking Masterclass', 
                                                        time: '1 day ago',
                                                        icon: '❤️'
                                                    }
                                                ].map((activity, index) => (
                                                    <div key={index} className="flex items-start py-3 border-b border-emerald-900/30 last:border-0">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl mr-3">
                                                            {activity.icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-emerald-200">
                                                                You <span className="text-amber-300">{activity.action}</span> "{activity.title}"
                                                            </p>
                                                            <p className="text-sm text-emerald-400/70 mt-1">
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Engagement Metrics */}
                                    <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden">
                                        <div className="px-5 py-6 sm:p-6">
                                            <h3 className="text-lg font-bold text-emerald-300 mb-5">
                                                Engagement Metrics
                                            </h3>
                                            <div className="space-y-4">
                                                {[
                                                    { 
                                                        metric: 'Channel Views', 
                                                        value: '24.5K', 
                                                        change: '+12.3%',
                                                        positive: true,
                                                        icon: '👁️'
                                                    },
                                                    { 
                                                        metric: 'Watch Time', 
                                                        value: '1,240 hrs', 
                                                        change: '+8.7%',
                                                        positive: true,
                                                        icon: '⏱️'
                                                    },
                                                    { 
                                                        metric: 'Subscribers', 
                                                        value: '2,458', 
                                                        change: '+3.2%',
                                                        positive: true,
                                                        icon: '👥'
                                                    }
                                                ].map((metric, index) => (
                                                    <div key={index} className="flex justify-between items-center py-3 border-b border-emerald-900/30 last:border-0">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl mr-3">
                                                                {metric.icon}
                                                            </div>
                                                            <div>
                                                                <p className="text-emerald-200 font-medium">
                                                                    {metric.metric}
                                                                </p>
                                                                <p className="text-2xl font-bold text-amber-300">
                                                                    {metric.value}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full ${metric.positive ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'} text-sm`}>
                                                            {metric.change}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden">
                                    <div className="px-5 py-6 sm:p-6">
                                        <h3 className="text-lg font-bold text-emerald-300 mb-5">
                                            Quick Actions
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <button 
                                                className="group flex flex-col items-center justify-center p-5 bg-gradient-to-b from-emerald-900/30 to-emerald-900/10 border border-emerald-900/30 rounded-xl hover:border-emerald-500/50 transition-all duration-300"
                                                onClick={() => window.location.href = '/upload'}
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:from-emerald-500 group-hover:to-emerald-700 transition-all">
                                                    <span>📤</span>
                                                </div>
                                                <span className="text-emerald-200 font-medium group-hover:text-amber-300 transition-colors">
                                                    Upload Video
                                                </span>
                                            </button>
                                            
                                            <button 
                                                className="group flex flex-col items-center justify-center p-5 bg-gradient-to-b from-emerald-900/30 to-emerald-900/10 border border-emerald-900/30 rounded-xl hover:border-emerald-500/50 transition-all duration-300"
                                                onClick={() => window.location.href = '/profile'}
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:from-emerald-500 group-hover:to-emerald-700 transition-all">
                                                    <span>👤</span>
                                                </div>
                                                <span className="text-emerald-200 font-medium group-hover:text-amber-300 transition-colors">
                                                    Edit Profile
                                                </span>
                                            </button>
                                            
                                            <button 
                                                className="group flex flex-col items-center justify-center p-5 bg-gradient-to-b from-emerald-900/30 to-emerald-900/10 border border-emerald-900/30 rounded-xl hover:border-emerald-500/50 transition-all duration-300"
                                                onClick={() => window.location.href = '/analytics'}
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:from-emerald-500 group-hover:to-emerald-700 transition-all">
                                                    <span>📊</span>
                                                </div>
                                                <span className="text-emerald-200 font-medium group-hover:text-amber-300 transition-colors">
                                                    View Analytics
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;