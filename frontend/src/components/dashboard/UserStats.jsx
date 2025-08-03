// src/components/dashboard/UserStats.jsx
const UserStats = ({ user }) => {
    const stats = [
        {
            name: 'Total Views',
            value: '24.5K',
            icon: '👁️',
            color: 'from-emerald-600 to-emerald-800',
            change: '+12.3%'
        },
        {
            name: 'Watch Time',
            value: '1,240 hrs',
            icon: '⏱️',
            color: 'from-amber-600 to-amber-800',
            change: '+8.7%'
        },
        {
            name: 'New Subscribers',
            value: '458',
            icon: '👥',
            color: 'from-emerald-600 to-emerald-800',
            change: '+3.2%'
        },
        {
            name: 'Engagement Rate',
            value: '42.8%',
            icon: '💬',
            color: 'from-amber-600 to-amber-800',
            change: '+5.1%'
        }
    ];

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden">
            <div className="px-5 py-6 sm:p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-bold text-emerald-300">
                        Analytics Overview
                    </h3>
                    <span className="text-sm text-emerald-400/80">Last 30 days</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-900/30 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300"
                        >
                            <div className="flex items-center">
                                <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 text-white text-2xl mr-4`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-400/80">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-amber-300">
                                        {stat.value}
                                    </p>
                                    <div className="text-xs mt-1 text-emerald-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {stat.change}
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