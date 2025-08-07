// src/components/common/ComingSoon.jsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    Sparkles,
    Clock,
    Bell,
    Rocket,
    Star,
    Zap
} from "lucide-react"

const ComingSoon = ({ 
    feature = "This Feature",
    description = "We're working hard to bring you an amazing new feature!",
    icon: Icon = Sparkles,
    estimatedDate = "Coming Soon",
    relatedFeatures = []
}) => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                {/* Main Content */}
                <div className="text-center space-y-8">
                    {/* Feature Icon */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-12 w-12 text-primary" />
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4">
                        <Badge variant="secondary" className="text-sm">
                            <Clock className="mr-1 h-3 w-3" />
                            {estimatedDate}
                        </Badge>
                        <h1 className="text-4xl font-bold doto-font-heading">
                            {feature} is Coming Soon!
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {description}
                        </p>
                    </div>

                    {/* Feature Preview Card */}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="h-5 w-5" />
                                What to Expect
                            </CardTitle>
                            <CardDescription>
                                Here's what we're building for you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm">Amazing User Experience</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Zap className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm">Lightning Fast Performance</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Bell className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">Smart Notifications</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    <span className="text-sm">Intuitive Design</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Features */}
                    {relatedFeatures.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">
                                While You Wait, Try These Features:
                            </h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {relatedFeatures.map((feature, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        onClick={() => navigate(feature.path)}
                                        className="flex items-center gap-2"
                                    >
                                        <feature.icon className="h-4 w-4" />
                                        {feature.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Want to be notified when this feature launches?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={() => navigate('/dashboard')}>
                                <Bell className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/')}>
                                Explore Videos
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon
