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
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 w-full relative">
                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-900/10 h-full w-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            {/* Profile Info */}
            <div className="px-5 py-6 relative -mt-16">
                {/* Avatar */}
                <div className="flex justify-center">
                    <div className="relative">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullname}
                                className="h-24 w-24 rounded-xl object-cover border-4 border-gray-900 shadow-lg"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center border-4 border-gray-900 shadow-lg">
                                <span className="text-2xl text-white font-bold">
                                    {getInitials(user?.fullname || 'User')}
                                </span>
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* User Details */}
                <div className="text-center mt-4">
                    <h3 className="text-xl font-bold text-emerald-300">
                        {user?.fullname}
                    </h3>
                    <p className="text-emerald-400/80">
                        @{user?.username}
                    </p>
                    <p className="text-sm text-emerald-500 mt-2">
                        {user?.email}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="text-center py-3 bg-emerald-900/30 rounded-xl">
                        <div className="text-amber-300 font-bold text-xl">24</div>
                        <div className="text-xs text-emerald-400/80">Videos</div>
                    </div>
                    <div className="text-center py-3 bg-emerald-900/30 rounded-xl">
                        <div className="text-amber-300 font-bold text-xl">2.4K</div>
                        <div className="text-xs text-emerald-400/80">Followers</div>
                    </div>
                    <div className="text-center py-3 bg-emerald-900/30 rounded-xl">
                        <div className="text-amber-300 font-bold text-xl">124</div>
                        <div className="text-xs text-emerald-400/80">Following</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-700/30"
                    >
                        Edit Profile
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full py-3 bg-gradient-to-r from-amber-900/30 to-amber-900/10 border border-amber-700/30 text-amber-300 rounded-xl hover:bg-amber-900/20 transition-all duration-300 flex items-center justify-center"
                    >
                        {isLoggingOut ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing out...
                            </>
                        ) : 'Sign Out'}
                    </button>
                </div>

                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-emerald-900/30">
                    <div className="text-sm text-emerald-400/80 space-y-2">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Member since: {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Videos in history: {user?.watchHistory?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Premium member</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;