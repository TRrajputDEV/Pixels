// src/components/home/Hero.jsx
const Hero = () => {
    return (
        <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
            {/* Geometric background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-900 rounded-full mix-blend-soft-light"></div>
                <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-900 rounded-full mix-blend-soft-light"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-900/20 to-amber-900/20 rounded-full mix-blend-soft-light"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center">
                    {/* Premium badge */}
                    <div className="inline-block mb-8">
                        <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase bg-amber-900/30 py-1.5 px-4 rounded-full border border-amber-700/30">
                            Premium Experience
                        </span>
                    </div>

                    {/* Elegant typography */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Where <span className="text-emerald-400">Creativity</span> Meets <span className="text-amber-300">Community</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                        Discover exceptional videos from talented creators worldwide.
                        Stream in stunning quality with our premium platform.
                    </p>

                    {/* Premium buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-600/20">
                            Start Watching
                        </button>
                        <button className="px-8 py-3.5 bg-transparent border border-emerald-600 text-emerald-300 font-medium rounded-lg hover:bg-emerald-900/30 transition-colors">
                            Become a Creator
                        </button>
                    </div>
                </div>

                {/* Preview thumbnails grid */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
                    {[
                        { bg: 'from-emerald-800/70 to-emerald-900/90', accent: 'bg-emerald-500' },
                        { bg: 'from-amber-800/70 to-amber-900/90', accent: 'bg-amber-400' },
                        { bg: 'from-emerald-800/70 to-emerald-900/90', accent: 'bg-emerald-500' },
                        { bg: 'from-amber-800/70 to-amber-900/90', accent: 'bg-amber-400' }
                    ].map((item, index) => (
                        <div key={index} className="aspect-video rounded-xl overflow-hidden border border-emerald-900/30 shadow-lg transition-transform hover:scale-[1.03] group">
                            <div className={`w-full h-full bg-gradient-to-br ${item.bg} flex items-center justify-center relative`}>
                                <div className="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse group-hover:animate-none group-hover:bg-amber-300"></div>
                                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-400/30 rounded-xl" />
                                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg border-2 border-amber-300/50"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;