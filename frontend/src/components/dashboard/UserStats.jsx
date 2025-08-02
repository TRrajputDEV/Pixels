// src/components/dashboard/UserStats.jsx
const UserStats = ({ user }) => {
    const stats = [
        {
            name: 'Videos Watched',
            value: user?.watchHistory?.length || 0,
            icon: '📺',
            color: 'bg-blue-500'
        },
        {
            name: 'Account Created',
            value: new Date(user?.createdAt).toLocaleDateString(),
            icon: '📅',
            color: 'bg-green-500'
        },
        {
            name: 'Profile Status',
            value: user?.avatar ? 'Complete' : 'Incomplete',
            icon: '✅',
            color: user?.avatar ? 'bg-green-500' : 'bg-yellow-500'
        }
    ];

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Account Overview
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="relative">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className={`${stat.color} rounded-md p-2 text-white text-xl`}>
                                        {stat.icon}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">
                                            {stat.name}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserStats;
