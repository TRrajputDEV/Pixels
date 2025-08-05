// src/components/home/HomePage.jsx
import { useState, useEffect } from 'react';
import VideoGrid from './VideoGrid';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);    
    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setVideos([
                {
                    _id: '1',
                    title: 'Amazing Nature Documentary: Exploring the Amazon Rainforest',
                    thumbnail: 'https://picsum.photos/320/180?random=1',
                    duration: '15:30',
                    views: 1500000,
                    createdAt: new Date(Date.now() - 86400000),
                    owner: {
                        fullname: 'Nature Channel',
                        username: 'naturechannel',
                        avatar: 'https://picsum.photos/40/40?random=10'
                    },
                    isLive: true
                },
                {
                    _id: '2',
                    title: 'Tech Review: Latest Smartphone Features You Need to Know',
                    thumbnail: 'https://picsum.photos/320/180?random=2',
                    duration: '12:45',
                    views: 850000,
                    createdAt: new Date(Date.now() - 172800000),
                    owner: {
                        fullname: 'Tech Guru',
                        username: 'techguru',
                        avatar: 'https://picsum.photos/40/40?random=11'
                    }
                },
                {
                    _id: '3',
                    title: 'Cooking Masterclass: Secrets of Michelin Star Chefs',
                    thumbnail: 'https://picsum.photos/320/180?random=3',
                    duration: '24:18',
                    views: 320000,
                    createdAt: new Date(Date.now() - 259200000),
                    owner: {
                        fullname: 'Culinary Arts',
                        username: 'culinaryarts',
                        avatar: 'https://picsum.photos/40/40?random=12'
                    }
                },
                {
                    _id: '4',
                    title: 'Workout Routine: Transform Your Body in 30 Days',
                    thumbnail: 'https://picsum.photos/320/180?random=4',
                    duration: '18:22',
                    views: 920000,
                    createdAt: new Date(Date.now() - 345600000),
                    owner: {
                        fullname: 'Fitness Pro',
                        username: 'fitnesspro',
                        avatar: 'https://picsum.photos/40/40?random=13'
                    },
                    isLive: true
                },
                {
                    _id: '5',
                    title: 'Music Production: How to Create Professional Beats',
                    thumbnail: 'https://picsum.photos/320/180?random=5',
                    duration: '28:45',
                    views: 450000,
                    createdAt: new Date(Date.now() - 432000000),
                    owner: {
                        fullname: 'Beat Master',
                        username: 'beatmaster',
                        avatar: 'https://picsum.photos/40/40?random=14'
                    }
                },
                {
                    _id: '6',
                    title: 'Travel Vlog: Exploring Hidden Gems of Japan',
                    thumbnail: 'https://picsum.photos/320/180?random=6',
                    duration: '22:30',
                    views: 780000,
                    createdAt: new Date(Date.now() - 518400000),
                    owner: {
                        fullname: 'Global Explorer',
                        username: 'globalexplorer',
                        avatar: 'https://picsum.photos/40/40?random=15'
                    }
                },
                {
                    _id: '7',
                    title: 'Gaming: Breaking Records in the Newest Release',
                    thumbnail: 'https://picsum.photos/320/180?random=7',
                    duration: '36:15',
                    views: 2100000,
                    createdAt: new Date(Date.now() - 604800000),
                    owner: {
                        fullname: 'Pro Gamer',
                        username: 'progamer',
                        avatar: 'https://picsum.photos/40/40?random=16'
                    },
                    isLive: true
                },
                {
                    _id: '8',
                    title: 'Art Tutorial: Mastering Watercolor Techniques',
                    thumbnail: 'https://picsum.photos/320/180?random=8',
                    duration: '19:40',
                    views: 360000,
                    createdAt: new Date(Date.now() - 691200000),
                    owner: {
                        fullname: 'Art Studio',
                        username: 'artstudio',
                        avatar: 'https://picsum.photos/40/40?random=17'
                    }
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="pt-16"> {/* Account for fixed navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold  mb-6 doto-font">Trending Videos</h2>
                <VideoGrid videos={videos} loading={loading} />
            </div>
        </div>
    );
};

export default HomePage;