// src/components/home/Hero.jsx
import { useState, useEffect } from 'react';
import Logo from '../ui/Logo';

const Hero = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 overflow-hidden min-h-[80vh] flex items-center">
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full mix-blend-soft-light animate-bounce-soft"></div>
                <div className="absolute bottom-10 -right-20 w-80 h-80 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full mix-blend-soft-light animate-bounce-soft" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/30 to-amber-500/30 rounded-full mix-blend-soft-light animate-pulse-slow"></div>
                
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-bounce-soft"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center">
                    {/* Enhanced logo display */}
                    <div className={`mb-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
                        <Logo size="large" showText={true} className="mx-auto mb-6" />
                    </div>

                    {/* Premium badge */}
                    <div className={`inline-block mb-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                        <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase bg-amber-900/30 py-2 px-6 rounded-full border border-amber-700/30 backdrop-blur-sm shadow-inner-light">
                            ✨ Premium Experience
                        </span>
                    </div>

                    {/* Elegant typography with animation */}
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                        Where <span className="text-gradient">Creativity</span> Meets <span className="text-gradient">Community</span>
                    </h1>

                    <p className={`text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
                        Discover exceptional videos from talented creators worldwide.
                        Stream in stunning quality with our premium platform.
                    </p>          
                </div>
            </div>
        </div>
    );
};

export default Hero;