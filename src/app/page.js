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
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
        >
            <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-center">{feature.title}</h3>
            <p className="text-sm opacity-90 text-center leading-relaxed">{feature.description}</p>
        </div>
    );
};

const SolutionItem = ({ solution, index }) => {
    const Icon = solution.icon;
    
    return (
        <div 
            className="flex items-start gap-4 group"
            style={{
                animation: `fadeInLeft 0.6s ease-out ${index * 0.15}s both`
            }}
        >
            <div className="bg-white/10 p-3 rounded-lg shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-semibold text-base mb-2">{solution.title}</h4>
                <p className="text-sm opacity-90 leading-relaxed">{solution.description}</p>
            </div>
        </div>
    );
};

const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        
        {[...Array(20)].map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}
            />
        ))}
    </div>
);

// ============ MAIN COMPONENT ============

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#5F6754] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative overflow-hidden">
            
            <AnimatedBackground />

            <div className="max-w-6xl w-full text-white relative z-10">
                
                {/* Header Section */}
                <header 
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
                    }`}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="relative">
                            <Utensils className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-yellow-300 animate-pulse" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                            Restaurant Management
                        </h1>
                    </div>
                    
                    <p className="text-lg lg:text-xl leading-relaxed opacity-95 max-w-3xl mx-auto px-4">
                        Streamline your restaurant operations with our comprehensive management solution. 
                        Everything you need to run your restaurant efficiently and profitably.
                    </p>
                </header>

                {/* Features Grid */}
                <section className="mb-16" aria-label="Key Features">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => (
                            <FeatureCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </div>
                </section>

                {/* Solutions Section */}
                <section 
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-10 mb-12 hover:bg-white/10 transition-all duration-500 border border-white/10"
                    aria-label="Complete Solutions"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.4s both'
                    }}
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-center">
                        Complete Restaurant Solution
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SOLUTIONS.map((solution, index) => (
                            <SolutionItem key={solution.title} solution={solution} index={index} />
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <footer 
                    className="text-center"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.6s both'
                    }}
                >
                    <p className="text-lg lg:text-xl leading-relaxed mb-8 opacity-95 max-w-2xl mx-auto px-4">
                        Experience seamless table reservations, real-time kitchen updates, and 
                        detailed analytics to help your business grow.
                    </p>

                    <Link 
                        href="/menu"
                        className="inline-block group"
                    >
                        <button className="bg-white text-[#5F6754] px-10 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl font-bold rounded-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 mx-auto relative overflow-hidden">
                            
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            <span className="relative">View Our Menu</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative" />
                        </button>
                    </Link>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex items-center justify-center gap-8 flex-wrap opacity-80">
                        <div className="text-center">
                            <div className="text-3xl font-bold">10+</div>
                            <div className="text-sm opacity-75">Happy Customers</div>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold">24/7</div>
                            <div className="text-sm opacity-75">Support</div>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold">99.9%</div>
                            <div className="text-sm opacity-75">Uptime</div>
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

                html {
                    scroll-behavior: smooth;
                }

                * {
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;