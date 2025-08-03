// src/components/ui/Logo.jsx
import { useState } from 'react';

const Logo = ({ size = 'default', showText = true, className = '', onClick = () => {} }) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizes = {
        small: {
            container: 'w-6 h-6',
            icon: 'w-3 h-3',
            text: 'text-lg',
            spacing: 'space-x-2'
        },
        default: {
            container: 'w-8 h-8',
            icon: 'w-4 h-4',
            text: 'text-xl',
            spacing: 'space-x-3'
        },
        large: {
            container: 'w-12 h-12',
            icon: 'w-6 h-6',
            text: 'text-2xl',
            spacing: 'space-x-4'
        }
    };

    const currentSize = sizes[size];

    return (
        <div 
            className={`flex items-center ${currentSize.spacing} group cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Enhanced Logo Icon */}
            <div className={`${currentSize.container} relative`}>
                {/* Main logo container with glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 rounded-xl backdrop-blur-sm border border-emerald-400/30 shadow-lg group-hover:shadow-glow-emerald transition-all duration-500">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0.5 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent animate-pulse-slow"></div>
                        
                        {/* Rotating rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`${currentSize.icon} relative`}>
                                {/* Outer ring */}
                                <div className={`absolute inset-0 border-2 border-amber-300/60 rounded-full ${
                                    isHovered ? 'animate-spin-slow' : 'animate-pulse'
                                } transition-all duration-300`}></div>
                                
                                {/* Inner ring */}
                                <div className={`absolute inset-1 border border-amber-400/80 rounded-full ${
                                    isHovered ? 'animate-spin-slow' : ''
                                } transition-all duration-300`} style={{
                                    animationDirection: 'reverse',
                                    animationDuration: '4s'
                                }}></div>
                                
                                {/* Center dot */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-1 h-1 bg-amber-200 rounded-full ${
                                        isHovered ? 'animate-bounce-soft' : 'animate-pulse'
                                    } transition-all duration-300`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Shine effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 ${
                            isHovered ? 'animate-shimmer' : ''
                        }`}></div>
                    </div>
                </div>
            </div>

            {/* Brand Text */}
            {showText && (
                <div className="relative">
                    <span className={`${currentSize.text} font-bold text-gradient group-hover:scale-105 transition-all duration-300 text-shadow`}>
                        Loop
                    </span>
                    {/* Text glow effect */}
                    <div className={`absolute inset-0 ${currentSize.text} font-bold text-emerald-400/30 blur-sm group-hover:blur-none transition-all duration-300`}>
                        Loop
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logo;
