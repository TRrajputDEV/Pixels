// src/components/pages/AboutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Info,
    Heart,
    Code,
    Coffee,
    Lightbulb,
    Target,
    Rocket,
    Github,
    Linkedin,
    Globe,
    Mail,
    Clock,
    Zap,
    Users,
    PlayCircle
} from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();

    // Your GitHub profile details
    const developerInfo = {
        name: "Tushar Tanwar",
        username: "TRrajputDEV",
        avatarUrl: "https://avatars.githubusercontent.com/TRrajputDEV?size=200",
        github: "https://github.com/TRrajputDEV/Pixels.git",
        linkedin: "https://www.linkedin.com/in/tushartanwar183",
        portfolio: "https://tushartanwar.netlify.app/", // Update this to your actual portfolio URL
        email: "mailto:tushartanwar183@gmail.com" // Update with your email
    };

    const journey = [
        {
            phase: "The Spark",
            icon: Lightbulb,
            description: "Started learning backend development through Chai Aur Code tutorials. What began as following along quickly became a passion for building something meaningful."
        },
        {
            phase: "The Obsession",
            icon: Coffee,
            description: "Countless late nights, debugging sessions, and 'just one more feature' moments. Each line of code was a step toward something bigger."
        },
        {
            phase: "The Vision",
            icon: Target,
            description: "Realized I wasn't just building an app—I was creating a platform where creators could share their stories and connect with the world."
        },
        {
            phase: "The Reality",
            icon: Rocket,
            description: "After months of solo development, Pixels is live. Every bug fixed, every feature added, every design decision—made with you in mind."
        }
    ];

    const personalStats = [
        {
            label: "Lines of Code",
            value: "10,000+",
            icon: Code,
            description: "Every single one written with purpose"
        },
        {
            label: "Late Nights",
            value: "100+",
            icon: Clock,
            description: "Fueled by passion and coffee"
        },
        {
            label: "Features Built",
            value: "25+",
            icon: Zap,
            description: "From video upload to secure streaming"
        },
        {
            label: "One Developer",
            value: "Just Me",
            icon: Users,
            description: "But dreaming of a community"
        }
    ];

    const techStack = [
        "React", "Node.js", "MongoDB", "Express.js",
        "Cloudinary", "JWT", "Tailwind CSS", "Mongoose"
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header with Personal Touch */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Heart className="h-10 w-10 text-red-500" />
                        <h1 className="text-4xl font-bold">Built with Passion</h1>
                        <Heart className="h-10 w-10 text-red-500" />
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        This isn't just another video platform. It's the result of one developer's dream to create
                        something meaningful—a place where every creator, no matter how small, can share their story with the world.
                    </p>
                </div>

                {/* Personal Introduction */}
                <Card className="mb-12 relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 border border-slate-700 dark:border-slate-600">
                    <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <Avatar className="w-32 h-32 ring-4 ring-blue-400 shadow-2xl">
                                <AvatarImage
                                    src={developerInfo.avatarUrl}
                                    alt={developerInfo.name}
                                    className="border-2 border-white/10"
                                />
                                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                                    {developerInfo.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
                                    Hi, I'm {developerInfo.name}
                                </h2>
                                <p className="text-lg text-blue-200 mb-4 font-medium">
                                    Solo Developer & Creator of Pixels
                                </p>
                                <p className="text-slate-200 mb-6 leading-relaxed">
                                    I'm a passionate full-stack developer who believes in the power of video to connect people.
                                    Pixels started as a learning project but grew into something much bigger—a platform built
                                    with love, late nights, and an unwavering belief that every creator deserves a voice.
                                </p>

                                {/* Social Links */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(developerInfo.github, '_blank')}
                                        className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <Github className="h-4 w-4" />
                                        GitHub
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(developerInfo.linkedin, '_blank')}
                                        className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(developerInfo.portfolio, '_blank')}
                                        className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Portfolio
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(developerInfo.email, '_blank')}
                                        className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20"></div>
                    </div>
                </Card>


                {/* The Journey */}
                <Card className="mb-12">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">The Journey Behind Pixels</CardTitle>
                        <p className="text-muted-foreground">
                            From tutorial student to platform creator—here's how it all began
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {journey.map((phase, index) => {
                                const Icon = phase.icon;
                                return (
                                    <div key={phase.phase} className="text-center p-6 rounded-lg bg-muted/30">
                                        <div className="relative mb-4">
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold mb-3 text-primary">{phase.phase}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {phase.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {personalStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.label} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium mb-2">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Why Pixels Exists */}
                <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <PlayCircle className="h-7 w-7 text-purple-600" />
                            Why Pixels Exists
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">
                            I built Pixels because I believe every creator deserves a platform that truly cares about their content.
                            Not just another corporate platform, but a place built by someone who understands the struggles of creating,
                            the joy of sharing, and the importance of community.
                        </p>
                        <div className="bg-white/50 rounded-lg p-6 max-w-2xl mx-auto">
                            <p className="italic text-muted-foreground">
                                "Every feature you see was built with a simple question in mind:
                                How can I make this better for creators like you?"
                            </p>
                            <p className="text-sm text-primary mt-2 font-medium">— Tushar Tanwar, Creator of Pixels</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Technology Stack */}
                <Card className="mb-12">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Code className="h-6 w-6" />
                            Built with Modern Technology
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Every technology choice was made with performance, security, and user experience in mind
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap justify-center gap-3">
                            {techStack.map((tech) => (
                                <Badge key={tech} variant="secondary" className="px-4 py-2">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-center text-muted-foreground mt-6 max-w-2xl mx-auto">
                            Built on the MERN stack with cloud-powered media delivery, ensuring smooth,
                            high-quality video streaming while keeping your content secure and your data private.
                        </p>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Join the Pixels Community</h2>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                            Pixels is more than a platform—it's a community of creators who believe in authentic storytelling.
                            Whether you're just starting out or already have an audience, there's a place for you here.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate('/register')}
                                className="bg-white text-blue-600 hover:bg-blue-50"
                            >
                                Start Your Journey
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/explore')}
                                className="border-white text-white hover:bg-white hover:text-blue-600"
                            >
                                Explore Content
                            </Button>
                        </div>
                        <p className="text-sm text-blue-200 mt-4">
                            Have questions or feedback? I'd love to hear from you personally.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AboutPage;
