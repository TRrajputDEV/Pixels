// src/components/dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import ProfileCard from './ProfileCard';
import UserStats from './UserStats';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.fullname}!
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <ProfileCard user={user} />
                        </div>

                        {/* Main Dashboard Content */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* User Stats */}
                                <UserStats user={user} />

                                {/* Recent Activity */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Recent Activity
                                        </h3>
                                        <div className="mt-4">
                                            <p className="text-gray-500">
                                                Your recent videos and interactions will appear here.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Quick Actions
                                        </h3>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                                Upload Video
                                            </button>
                                            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                                Edit Profile
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
