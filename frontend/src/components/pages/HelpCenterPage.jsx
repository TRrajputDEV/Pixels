// src/components/pages/HelpCenterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
    HelpCircle, 
    Search, 
    ChevronDown, 
    ChevronUp,
    Book,
    Shield,
    Upload,
    Settings,
    MessageCircle,
    Mail,
    Phone,
    Clock,
    CheckCircle,
    AlertTriangle,
    Info
} from 'lucide-react';

const HelpCenterPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const faqCategories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Book,
            color: 'bg-blue-500',
            faqs: [
                {
                    question: 'How do I create an account?',
                    answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address to get started.'
                },
                {
                    question: 'How do I upload my first video?',
                    answer: 'After logging in, click the "Upload" button in the navigation menu, select your video file and thumbnail, add a title and description, then click "Publish".'
                },
                {
                    question: 'Can I edit my video after uploading?',
                    answer: 'Yes! Go to "My Videos" in your dashboard, find your video, and click "Edit" to update the title, description, or thumbnail.'
                },
                {
                    question: 'What video formats are supported?',
                    answer: 'We support MP4, AVI, MOV, and most common video formats. For best quality, we recommend MP4 with H.264 encoding.'
                }
            ]
        },
        {
            id: 'account-security',
            title: 'Account & Security',
            icon: Shield,
            color: 'bg-green-500',
            faqs: [
                {
                    question: 'How do I change my password?',
                    answer: 'Click on your Avatar >  profile Settings > Security, enter your current password and new password, then click "Update Password".'
                },
                {
                    question: 'Is my personal information secure?',
                    answer: 'Yes! We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties.'
                },
                {
                    question: 'How do I delete my account?',
                    answer: 'Contact our support team at support@pixels.com to request account deletion. This action is irreversible.'
                },
                {
                    question: 'Can I make my videos private?',
                    answer: 'Yes, when uploading or editing a video, you can set the visibility to private so only you can view it.'
                }
            ]
        },
        {
            id: 'uploading',
            title: 'Video Upload',
            icon: Upload,
            color: 'bg-purple-500',
            faqs: [
                {
                    question: 'What is the maximum file size for uploads?',
                    answer: 'You can upload videos up to 2GB in size. For larger files, consider compressing your video first.'
                },
                {
                    question: 'How long does it take to process a video?',
                    answer: 'Processing typically takes 2-10 minutes depending on video length and quality. You\'ll get a notification when it\'s ready.'
                },
                {
                    question: 'Why is my upload failing?',
                    answer: 'Check your internet connection, ensure your file is under 2GB, and verify it\'s in a supported format. Try refreshing the page and uploading again.'
                },
                {
                    question: 'Can I upload multiple videos at once?',
                    answer: 'Currently, you can upload one video at a time. Batch uploading is planned for a future update.'
                }
            ]
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: Settings,
            color: 'bg-orange-500',
            faqs: [
                {
                    question: 'Videos won\'t play - what should I do?',
                    answer: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. Ensure you have a stable internet connection.'
                },
                {
                    question: 'The website is loading slowly',
                    answer: 'This might be due to your internet connection or high server traffic. Try refreshing the page or accessing the site later.'
                },
                {
                    question: 'I\'m not receiving notification emails',
                    answer: 'Check your spam folder and ensure notifications are enabled in your account settings. Add our email domain to your safe sender list.'
                },
                {
                    question: 'How do I report inappropriate content?',
                    answer: 'Click the "Report" button on any video or comment that violates our community guidelines. Our team will review it promptly.'
                }
            ]
        }
    ];

    const contactOptions = [
        {
            method: 'Email Support',
            details: 'support@pixels.com',
            icon: Mail,
            description: 'Get help via email within 24 hours'
        },
        {
            method: 'Community Forum',
            details: 'Visit our forum',
            icon: MessageCircle,
            description: 'Connect with other users and get answers'
        },
        {
            method: 'Help Chat',
            details: 'Coming Soon',
            icon: Phone,
            description: 'Real-time chat support (in development)'
        }
    ];

    const filteredFAQs = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <HelpCircle className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold">Help Center</h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Find answers to common questions and get the support you need to make the most of Pixels.
                    </p>
                </div>

                {/* Search */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for help articles, tutorials, and more..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Articles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-6 text-center">
                            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Getting Started Guide</h3>
                            <p className="text-sm text-muted-foreground">Learn the basics of using Pixels</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-6 text-center">
                            <Upload className="h-8 w-8 text-green-500 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Upload Tutorial</h3>
                            <p className="text-sm text-muted-foreground">Step-by-step video uploading</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200 bg-purple-50/50">
                        <CardContent className="p-6 text-center">
                            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Privacy & Security</h3>
                            <p className="text-sm text-muted-foreground">Keep your account secure</p>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    {(searchTerm ? filteredFAQs : faqCategories).map((category) => {
                        const Icon = category.icon;
                        return (
                            <Card key={category.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${category.color} text-white`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        {category.title}
                                        <Badge variant="secondary">{category.faqs.length}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {category.faqs.map((faq, index) => (
                                            <Collapsible key={index}>
                                                <CollapsibleTrigger
                                                    className="flex items-center justify-between w-full p-3 text-left rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                                    onClick={() => toggleSection(`${category.id}-${index}`)}
                                                >
                                                    <span className="font-medium text-sm">{faq.question}</span>
                                                    {openSections[`${category.id}-${index}`] ? 
                                                        <ChevronUp className="h-4 w-4" /> : 
                                                        <ChevronDown className="h-4 w-4" />
                                                    }
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="px-3 py-2">
                                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Contact Support */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Still Need Help?</CardTitle>
                        <p className="text-muted-foreground">
                            Can't find what you're looking for? Get in touch with our support team.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div key={option.method} className="text-center p-4 rounded-lg bg-muted/50">
                                        <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                        <h3 className="font-semibold mb-1">{option.method}</h3>
                                        <p className="text-sm text-primary mb-2">{option.details}</p>
                                        <p className="text-xs text-muted-foreground">{option.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">Support Hours</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Our support team is available Monday to Friday, 9 AM - 6 PM (UTC). 
                                We typically respond to emails within 24 hours.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HelpCenterPage;
