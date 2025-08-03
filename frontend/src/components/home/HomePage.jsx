// src/components/home/HomePage.jsx
import { useState, useEffect } from 'react';
import VideoGrid from './VideoGrid';
import Hero from './Hero';

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
                    title: 'Amazing Nature Documentary',
                    thumbnail: 'https://picsum.photos/320/180?random=1',
                    duration: '15:30',
                    views: 1500000,
                    createdAt: new Date(Date.now() - 86400000),
                    owner: {
                        fullname: 'Nature Channel',
                        username: 'naturechannel',
                        avatar: 'https://picsum.photos/40/40?random=10'
                    }
                },
                {
                    _id: '2',
                    title: 'Tech Review: Latest Smartphone',
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
                // Add more mock videos...
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="pt-16"> {/* Account for fixed navbar */}
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Videos</h2>
                <VideoGrid videos={videos} loading={loading} />
            </div>
        </div>
    );
};

export default HomePage;
