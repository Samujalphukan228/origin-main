"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Utensils, ClipboardList, Package, Users, TrendingUp, 
    ArrowRight, ChefHat, ShoppingCart, BarChart3, Sparkles 
} from 'lucide-react';

// ============ CONSTANTS ============

const FEATURES = [
    {
        icon: ClipboardList,
        title: 'Order Tracking',
        description: 'Real-time order monitoring and updates'
    },
    {
        icon: Package,
        title: 'Inventory Control',
        description: 'Track stock levels automatically'
    },
    {
        icon: Users,
        title: 'Customer Service',
        description: 'Enhance guest experience'
    },
    {
        icon: TrendingUp,
        title: 'Analytics',
        description: 'Detailed business insights'
    }
];

const SOLUTIONS = [
    {
        icon: ChefHat,
        title: 'Kitchen Management',
        description: 'Coordinate orders seamlessly with your kitchen staff'
    },
    {
        icon: ShoppingCart,
        title: 'Menu Management',
        description: 'Update and manage your menu with ease'
    },
    {
        icon: BarChart3,
        title: 'Sales Reports',
        description: 'Track performance and make data-driven decisions'
    }
];

// ============ COMPONENTS ============

const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;
    
    return (
        <div 
            className="bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group border-2 border-gray-100 hover:border-[#5F6754]/30 relative overflow-hidden"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5F6754]/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex justify-center mb-6 relative z-10">
                <div className="bg-gradient-to-br from-[#5F6754] to-[#4a5143] p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
            </div>
            
            <h3 className="font-bold text-xl mb-3 text-center text-[#5F6754] group-hover:text-[#4a5143] transition-colors">
                {feature.title}
            </h3>
            <p className="text-sm text-gray-600 text-center leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
};

const SolutionItem = ({ solution, index }) => {
    const Icon = solution.icon;
    
    return (
        <div 
            className="flex flex-col items-center text-center gap-4 group p-6 rounded-xl hover:bg-[#5F6754]/5 transition-all duration-300"
            style={{
                animation: `fadeInLeft 0.6s ease-out ${index * 0.15}s both`
            }}
        >
            <div className="bg-gradient-to-br from-[#5F6754] to-[#4a5143] p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-2 text-[#5F6754]">{solution.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
            </div>
        </div>
    );
};

const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#5F6754]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#5F6754]/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5F6754]/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
        
        {/* Floating Dots */}
        {[...Array(30)].map((_, i) => (
            <div
                key={i}
                className="absolute w-2 h-2 bg-[#5F6754]/20 rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}
            />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#5F6754_1px,transparent_1px),linear-gradient(to_bottom,#5F6754_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02]" />
    </div>
);

// ============ MAIN COMPONENT ============

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative overflow-hidden">
            
            <AnimatedBackground />

            <div className="max-w-7xl w-full relative z-10">
                
                {/* Header Section */}
                <header 
                    className={`text-center mb-20 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                    }`}
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#5F6754] blur-xl opacity-50 animate-pulse" />
                            <div className="relative bg-gradient-to-br from-[#5F6754] to-[#4a5143] p-4 rounded-2xl shadow-2xl">
                                <Utensils className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                            </div>
                            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-yellow-500 animate-bounce" />
                        </div>
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-[#5F6754] via-[#4a5143] to-[#5F6754] bg-clip-text text-transparent">
                        Restaurant Management
                    </h1>
                    
                    <p className="text-lg lg:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto px-4 font-medium">
                        Streamline your restaurant operations with our comprehensive management solution. 
                        Everything you need to run your restaurant <span className="text-[#5F6754] font-bold">efficiently and profitably</span>.
                    </p>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#5F6754] rounded-full" />
                        <div className="w-3 h-3 bg-[#5F6754] rounded-full animate-pulse" />
                        <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#5F6754] rounded-full" />
                    </div>
                </header>

                {/* Features Grid */}
                <section className="mb-20" aria-label="Key Features">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-[#5F6754]">
                        Powerful Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {FEATURES.map((feature, index) => (
                            <FeatureCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </div>
                </section>

                {/* Solutions Section */}
                <section 
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 lg:p-14 mb-16 shadow-2xl border-2 border-gray-100 hover:border-[#5F6754]/30 transition-all duration-500 relative overflow-hidden"
                    aria-label="Complete Solutions"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.4s both'
                    }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#5F6754]/10 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#5F6754]/10 to-transparent rounded-full transform -translate-x-32 translate-y-32" />
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-black mb-4 text-center bg-gradient-to-r from-[#5F6754] to-[#4a5143] bg-clip-text text-transparent">
                            Complete Restaurant Solution
                        </h2>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
                            Everything you need in one powerful platform
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                            {SOLUTIONS.map((solution, index) => (
                                <SolutionItem key={solution.title} solution={solution} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <footer 
                    className="text-center"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.6s both'
                    }}
                >
                    <div className="bg-gradient-to-br from-[#5F6754] to-[#4a5143] rounded-3xl p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer" />
                        
                        <div className="relative z-10">
                            <p className="text-xl lg:text-2xl leading-relaxed mb-10 text-white/95 max-w-2xl mx-auto px-4 font-medium">
                                Experience seamless table reservations, real-time kitchen updates, and 
                                detailed analytics to help your business <span className="font-bold text-yellow-300">grow exponentially</span>.
                            </p>

                            <Link 
                                href="/menu"
                                className="inline-block group"
                            >
                                <button className="bg-white text-[#5F6754] px-12 lg:px-16 py-5 lg:py-6 text-xl lg:text-2xl font-black rounded-2xl hover:shadow-2xl hover:-translate-y-3 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-4 mx-auto relative overflow-hidden">
                                    
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5F6754]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    
                                    <span className="relative">View Our Menu</span>
                                    <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-300 relative" />
                                </button>
                            </Link>

                            {/* Trust Indicators */}
                            <div className="mt-14 flex items-center justify-center gap-12 lg:gap-16 flex-wrap">
                                <div className="text-center">
                                    <div className="text-4xl lg:text-5xl font-black text-white mb-2">10+</div>
                                    <div className="text-sm lg:text-base text-white/80 font-medium">Happy Customers</div>
                                </div>
                                <div className="hidden sm:block w-px h-16 bg-white/30" />
                                <div className="text-center">
                                    <div className="text-4xl lg:text-5xl font-black text-white mb-2">24/7</div>
                                    <div className="text-sm lg:text-base text-white/80 font-medium">Support</div>
                                </div>
                                <div className="hidden sm:block w-px h-16 bg-white/30" />
                                <div className="text-center">
                                    <div className="text-4xl lg:text-5xl font-black text-white mb-2">99.9%</div>
                                    <div className="text-sm lg:text-base text-white/80 font-medium">Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>

            {/* Global Animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(-40px) translateX(-10px);
                    }
                    75% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -250% 0;
                    }
                    100% {
                        background-position: 250% 0;
                    }
                }

                html {
                    scroll-behavior: smooth;
                }

                * {
                    -webkit-tap-highlight-color: transparent;
                }

                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;