// src/components/dashboard/UserStats.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Eye, 
    Clock, 
    Users, 
    MessageSquare, 
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react"

const UserStats = ({ user }) => {
    // Placeholder stats - replace with actual data from backend
    const stats = [
        {
            name: 'Total Views',
            value: '--',
            icon: Eye,
            change: null, // Will be populated from backend
            description: 'Total video views'
        },
        {
            name: 'Watch Time',
            value: '-- hrs',
            icon: Clock,
            change: null,
            description: 'Total watch hours'
        },
        {
            name: 'Subscribers',
            value: '--',
            icon: Users,
            change: null,
            description: 'Channel subscribers'
        },
        {
            name: 'Engagement',
            value: '--%',
            icon: MessageSquare,
            change: null,
            description: 'Average engagement rate'
        }
    ];

    const getChangeIcon = (change) => {
        if (!change) return <Minus className="h-3 w-3" />;
        if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
        return <TrendingDown className="h-3 w-3 text-red-500" />;
    };

    const getChangeColor = (change) => {
        if (!change) return 'secondary';
        if (change > 0) return 'default';
        return 'destructive';
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg font-semibold">Analytics Overview</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Your content performance metrics
                    </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                    Last 30 days
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div 
                                key={index} 
                                className="flex flex-col space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <IconComponent className="h-4 w-4 text-primary" />
                                    </div>
                                    {stat.change !== null && (
                                        <Badge 
                                            variant={getChangeColor(stat.change)} 
                                            className="text-xs px-2 py-1 h-auto"
                                        >
                                            {getChangeIcon(stat.change)}
                                            <span className="ml-1">
                                                {stat.change ? `${stat.change > 0 ? '+' : ''}${stat.change}%` : '--'}
                                            </span>
                                        </Badge>
                                    )}
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold doto-font">
                                        {stat.value}
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Placeholder message for when backend is not connected */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border-dashed border-2 border-muted-foreground/20">
                    <div className="text-center text-muted-foreground">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm font-medium mb-1">Analytics data will appear here</p>
                        <p className="text-xs">Coming soon</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserStats;