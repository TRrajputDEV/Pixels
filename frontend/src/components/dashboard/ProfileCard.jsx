// src/components/dashboard/ProfileCard.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
        setIsLoggingOut(false);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                {/* Cover Image */}
                {user?.coverImage && (
                    <div className="h-32 w-full mb-4 rounded-lg overflow-hidden">
                        <img
                            src={user.coverImage}
                            alt="Cover"
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Profile Info */}
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullname}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                    {getInitials(user?.fullname || 'User')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            {user?.fullname}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                            @{user?.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Edit Profile
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>

                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                        <p>Videos in history: {user?.watchHistory?.length || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
