"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
    Utensils, ClipboardList, Package, Users, TrendingUp, 
    ArrowRight, ChefHat, ShoppingCart, BarChart3, Sparkles,
    Star, Clock, Award, Coffee, Heart, Globe, Shield,
    CheckCircle, Play, Quote, Menu, X, ArrowUpRight
} from 'lucide-react';

// ============ CONSTANTS ============

const FEATURES = [
    {
        icon: ClipboardList,
        title: 'Smart Orders',
        description: 'AI-powered order management with real-time updates',
        color: 'from-blue-500 to-cyan-500',
        delay: 0
    },
    {
        icon: Package,
        title: 'Auto Inventory',
        description: 'Predictive stock management to reduce waste',
        color: 'from-purple-500 to-pink-500',
        delay: 0.1
    },
    {
        icon: Users,
        title: 'Guest Insights',
        description: 'Personalized experiences that delight customers',
        color: 'from-green-500 to-emerald-500',
        delay: 0.2
    },
    {
        icon: TrendingUp,
        title: 'Growth Analytics',
        description: 'Data-driven decisions for exponential growth',
        color: 'from-orange-500 to-red-500',
        delay: 0.3
    }
];

const STATS = [
    { value: '500+', label: 'Restaurants', icon: Utensils },
    { value: '50K+', label: 'Daily Orders', icon: ShoppingCart },
    { value: '4.9★', label: 'Rating', icon: Star },
    { value: '99.9%', label: 'Uptime', icon: Shield }
];

const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'Owner, Lotus Garden',
        content: 'Transformed our operations completely. We\'ve seen a 40% increase in efficiency.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=5F6754&color=fff'
    },
    {
        name: 'Marcus Rivera',
        role: 'Manager, The Bistro',
        content: 'The analytics alone have helped us reduce waste by 30% and increase profits.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Marcus+Rivera&background=5F6754&color=fff'
    },
    {
        name: 'Emily Foster',
        role: 'Chef, Coastal Kitchen',
        content: 'Kitchen coordination has never been smoother. Our team loves it!',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Emily+Foster&background=5F6754&color=fff'
    }
];

// ============ COMPONENTS ============

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-[#5F6754] to-[#4a5143] p-2 rounded-lg">
                            <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">RestaurantOS</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-gray-600 hover:text-[#5F6754] transition-colors">Features</Link>
                        <Link href="#solutions" className="text-gray-600 hover:text-[#5F6754] transition-colors">Solutions</Link>
                        <Link href="#testimonials" className="text-gray-600 hover:text-[#5F6754] transition-colors">Testimonials</Link>
                        <Link href="/menu">
                            <button className="bg-gradient-to-r from-[#5F6754] to-[#4a5143] text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                                View Demo
                            </button>
                        </Link>
                    </div>

                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-4 space-y-3">
                            <Link href="#features" className="block py-2 text-gray-600">Features</Link>
                            <Link href="#solutions" className="block py-2 text-gray-600">Solutions</Link>
                            <Link href="#testimonials" className="block py-2 text-gray-600">Testimonials</Link>
                            <Link href="/menu" className="block">
                                <button className="w-full bg-gradient-to-r from-[#5F6754] to-[#4a5143] text-white py-2 rounded-full">
                                    View Demo
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const HeroSection = () => {
    const videoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-amber-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(95,103,84,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(95,103,84,0.06),transparent_50%)]" />
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 10}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${10 + i * 2}s`
                        }}
                    >
                        <div className="w-64 h-64 bg-gradient-to-br from-[#5F6754]/10 to-transparent rounded-full blur-3xl" />
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-semibold text-amber-700">AI-Powered Platform</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-gray-900 via-[#5F6754] to-gray-900 bg-clip-text text-transparent">
                                Run Your Restaurant
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-[#5F6754] to-[#4a5143] bg-clip-text text-transparent">
                                Like Never Before
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Join 500+ restaurants using our platform to streamline operations, 
                            boost profits, and deliver exceptional dining experiences.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                            <Link href="/menu">
                                <button className="group bg-gradient-to-r from-[#5F6754] to-[#4a5143] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button 
                                onClick={() => setIsVideoPlaying(true)}
                                className="group bg-white border-2 border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:border-[#5F6754] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <div className="w-10 h-10 bg-[#5F6754]/10 rounded-full flex items-center justify-center group-hover:bg-[#5F6754]/20">
                                    <Play className="w-5 h-5 text-[#5F6754] ml-0.5" />
                                </div>
                                Watch Demo
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center gap-8 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-600 font-medium">Secure & Reliable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-gray-600 font-medium">24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative lg:block hidden">
                        <div className="relative w-full h-[600px]">
                            {/* Main card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden">
                                <div className="p-8">
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-semibold text-gray-600">Today's Performance</span>
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-2">$12,847</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 text-sm font-medium">↑ 23%</span>
                                            <span className="text-gray-500 text-sm">vs yesterday</span>
                                        </div>
                                    </div>

                                    {/* Mini stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Orders', value: '142', icon: ShoppingCart, color: 'blue' },
                                            { label: 'Customers', value: '89', icon: Users, color: 'purple' },
                                            { label: 'Avg Order', value: '$90', icon: Award, color: 'orange' },
                                            { label: 'Rating', value: '4.9', icon: Star, color: 'yellow' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow">
                                                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                                                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                                <div className="text-xs text-gray-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating cards */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Order #1234</div>
                                        <div className="text-xs text-gray-500">Completed</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Peak Hour Alert</div>
                                        <div className="text-xs text-gray-500">6:00 PM - 8:00 PM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-[#5F6754] to-[#4a5143] relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center group"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-white/80 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ModernFeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;
    
    return (
        <div 
            className="group relative"
            style={{
                animation: `fadeInUp 0.6s ease-out ${feature.delay}s both`
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl transform transition-transform group-hover:scale-105" />
            <div className="relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                
                <button className="inline-flex items-center gap-2 text-[#5F6754] font-semibold group/btn">
                    Learn more 
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            
            <Quote className="w-8 h-8 text-gray-200 mb-4" />
            
            <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
            </p>
            
            <div className="flex items-center gap-4">
                <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
            </div>
        </div>
    );
};

// ============ MAIN COMPONENT ============

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            
            <HeroSection />
            
            <StatsSection />

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#5F6754]/10 rounded-full px-4 py-2 mb-4">
                            <Sparkles className="w-4 h-4 text-[#5F6754]" />
                            <span className="text-sm font-semibold text-[#5F6754]">Powerful Features</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Everything you need to succeed
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive platform provides all the tools necessary to run a modern, efficient restaurant
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => (
                            <ModernFeatureCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Loved by restaurant owners
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what our customers have to say about their experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#5F6754] to-[#4a5143] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to transform your restaurant?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Join hundreds of successful restaurants. Start your free trial today.
                    </p>
                    <Link href="/menu">
                        <button className="group bg-white text-[#5F6754] px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
                            Get Started Now
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </Link>
                </div>
            </section>

            {/* Global Styles */}
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

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(10deg);
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 10s ease-in-out infinite;
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
