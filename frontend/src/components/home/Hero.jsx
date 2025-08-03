// src/components/home/Hero.jsx
const Hero = () => {
    return (
        <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to StreamTube
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Discover amazing videos from creators around the world
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                            Start Watching
                        </button>
                        <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
