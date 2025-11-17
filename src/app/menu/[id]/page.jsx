"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
    ArrowLeft, 
    Star, 
    Loader2, 
    Share2, 
    Heart, 
    ShoppingCart, 
    Check,
    ChefHat,
    Leaf,
    Plus,
    Minus,
    X
} from 'lucide-react';
import Link from 'next/link';

const MenuDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [menu, setMenu] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageError, setImageError] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (params.id) {
            fetchMenuItem();
            fetchRelatedItems();
        }
    }, [params.id]);

    useEffect(() => {
        if (menu) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favorites.includes(menu._id));
        }
    }, [menu]);

    const fetchMenuItem = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_URL}/api/menu/${params.id}`);
            
            if (response.data.success) {
                setMenu(response.data.menu);
            }
        } catch (err) {
            console.error('Error fetching menu item:', err);
            setError(err.response?.data?.message || 'Failed to load menu item');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/menu/public`);
            if (response.data.success) {
                const filtered = response.data.menus
                    .filter(item => item._id !== params.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
                setRelatedItems(filtered);
            }
        } catch (err) {
            console.error('Error fetching related items:', err);
        }
    };

    const handleAddToCart = () => {
        console.log('Add to cart:', { menuId: menu._id, quantity });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;
        
        if (isFavorite) {
            newFavorites = favorites.filter(id => id !== menu._id);
        } else {
            newFavorites = [...favorites, menu._id];
        }
        
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: menu.name,
                    text: menu.description,
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    const handleImageChange = (index) => {
        setSelectedImage(index);
        setImageLoading(true);
        setImageError(false);
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#5F6754] animate-spin mx-auto mb-3" />
                    <p className="text-[#5F6754] text-sm tracking-wider">Loading...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !menu) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <X className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Item Not Found</h2>
                    <p className="text-gray-600 mb-6 text-sm">{error || 'This item is not available'}</p>
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 bg-[#5F6754] text-white px-6 py-3 rounded-lg hover:bg-[#4a5143] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Image Modal */}
            {showImageModal && (
                <div 
                    className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={menu.image[selectedImage]}
                        alt={menu.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}

            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/menu')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#5F6754] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm uppercase tracking-wider font-medium">Back</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleToggleFavorite}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                                    isFavorite 
                                        ? 'bg-red-50 border-red-300 text-red-500' 
                                        : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300'
                                }`}
                                aria-label="Add to favorites"
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-full border border-gray-300 text-gray-400 hover:text-[#5F6754] hover:border-[#5F6754] flex items-center justify-center transition-colors"
                                aria-label="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div 
                            className="relative bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
                            onClick={() => setShowImageModal(true)}
                        >
                            <div className="aspect-square relative">
                                {imageLoading && !imageError && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-[#5F6754] animate-spin" />
                                    </div>
                                )}
                                {!imageError ? (
                                    <img
                                        src={menu.image[selectedImage]}
                                        alt={menu.name}
                                        className="w-full h-full object-cover"
                                        onLoad={() => setImageLoading(false)}
                                        onError={() => {
                                            setImageLoading(false);
                                            setImageError(true);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-16 h-16 border-2 border-gray-300 rounded-full" />
                                    </div>
                                )}
                                
                                {menu.bestseller && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#5F6754] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-medium">Featured</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {menu.image.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {menu.image.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageChange(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index 
                                                ? 'border-[#5F6754] scale-105' 
                                                : 'border-gray-200 hover:border-gray-300 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${menu.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Features - Desktop Only */}
                        <div className="hidden lg:grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#5F6754]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ChefHat className="w-5 h-5 text-[#5F6754]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Chef's</p>
                                    <p className="font-medium text-gray-900 text-sm">Special</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Leaf className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fresh</p>
                                    <p className="font-medium text-gray-900 text-sm">Ingredients</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3">
                                {menu.name}
                            </h1>
                            <p className="text-3xl sm:text-4xl font-light text-[#5F6754]">
                                ${menu.price.toFixed(2)}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">About This Dish</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {menu.description}
                            </p>
                        </div>

                        {/* Features - Mobile Only */}
                        <div className="grid grid-cols-2 gap-3 lg:hidden">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#5F6754]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ChefHat className="w-4 h-4 text-[#5F6754]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Chef's</p>
                                    <p className="font-medium text-gray-900 text-xs">Special</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Leaf className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Fresh</p>
                                    <p className="font-medium text-gray-900 text-xs">Ingredients</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">Quantity</h2>
                            <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={decrementQuantity}
                                    className="w-10 h-10 rounded-md bg-white hover:bg-[#5F6754] hover:text-white border border-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-xl font-light w-10 text-center">{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    className="w-10 h-10 rounded-md bg-white hover:bg-[#5F6754] hover:text-white border border-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="bg-[#5F6754]/5 p-5 rounded-lg border border-[#5F6754]/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Total</p>
                                    <p className="text-sm text-gray-500">{quantity} × ${menu.price.toFixed(2)}</p>
                                </div>
                                <span className="text-3xl font-light text-[#5F6754]">
                                    ${(menu.price * quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-4 rounded-lg font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                                addedToCart
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[#5F6754] text-white hover:bg-[#4a5143]'
                            }`}
                        >
                            {addedToCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </>
                            )}
                        </button>

                        {/* Additional Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2.5">
                            <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">Prepared fresh daily</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">Premium ingredients</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">Expert chefs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Items */}
                {relatedItems.length > 0 && (
                    <div className="mt-16 sm:mt-20">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">You Might Also Like</h2>
                            <p className="text-gray-500 text-sm">Explore more options</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedItems.map((item) => (
                                <Link
                                    key={item._id}
                                    href={`/menu/${item._id}`}
                                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#5F6754]/20 transition-all duration-300"
                                >
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        <img
                                            src={item.image[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-medium text-gray-900 group-hover:text-[#5F6754] transition-colors line-clamp-1 text-sm">
                                                {item.name}
                                            </h3>
                                            {item.bestseller && (
                                                <Star className="w-4 h-4 text-[#5F6754] fill-current flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[#5F6754] font-semibold">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                * {
                    -webkit-tap-highlight-color: transparent;
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
};

export default MenuDetailPage;