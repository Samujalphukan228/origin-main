"use client";

import { useMenu } from '@/context/MenuContext';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Star, Plus, Minus, ShoppingCart, Check, AlertCircle,
    Loader2, X, Share2, Heart, ChefHat, Leaf, Package
} from 'lucide-react';

// ============ COMPONENTS ============

// Toast Notification
const Toast = ({ message, type }) => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
        <div className={`px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 backdrop-blur-sm ${
            type === 'success' 
                ? 'bg-emerald-500 border-emerald-400 text-white' 
                : 'bg-red-500 border-red-400 text-white'
        }`}>
            {type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message}</p>
        </div>
    </div>
);

// Related Product Card
const RelatedProductCard = ({ menu, sessionToken, tableNumber }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/s/${sessionToken}/${tableNumber}/menu/${menu._id}`}
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#5F6754]/20 transition-all duration-300"
        >
            <div className="aspect-square bg-gray-100 overflow-hidden">
                {!imageError ? (
                    <img
                        src={menu.image[0]}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-gray-200 rounded-full" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#5F6754] transition-colors line-clamp-1 text-sm">
                        {menu.name}
                    </h3>
                    {menu.bestseller && (
                        <Star className="w-4 h-4 text-[#5F6754] fill-current flex-shrink-0" />
                    )}
                </div>
                <p className="text-[#5F6754] font-semibold">
                    ${menu.price.toFixed(2)}
                </p>
            </div>
        </Link>
    );
};

// ============ MAIN COMPONENT ============

const ProductDetailPage = () => {
    const params = useParams();
    const router = useRouter();

    const urlSessionToken = params.session;
    const urlTableNumber = params.table;
    const productId = params.id;

    const {
        menus,
        loading: menuLoading,
        cart,
        addToCart,
        sessionValid,
        tableNumber: menuTableNumber,
        initializeSession: initMenuSession,
    } = useMenu();

    // State
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState(null);
    const [validatingSession, setValidatingSession] = useState(true);
    const [sessionError, setSessionError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Find current product
    const product = useMemo(
        () => menus.find((m) => m._id === productId),
        [menus, productId]
    );

    // Find related products
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return menus
            .filter((m) => m._id !== productId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [menus, product, productId]);

    // Check if product is in cart
    const cartItem = useMemo(
        () => cart.find((item) => item._id === productId),
        [cart, productId]
    );

    // ============ CALLBACKS ============

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        
        let successCount = 0;
        for (let i = 0; i < quantity; i++) {
            const result = addToCart(product);
            if (result.success) {
                successCount++;
            } else {
                showToast(result.message, 'error');
                break;
            }
        }

        if (successCount > 0) {
            showToast(
                `${successCount} ${successCount === 1 ? 'item' : 'items'} added to cart`,
                'success'
            );
            setQuantity(1);
        }

        setAddingToCart(false);
    };

    const handleImageChange = (index) => {
        setSelectedImage(index);
        setImageLoading(true);
        setImageError(false);
    };

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;
        
        if (isFavorite) {
            newFavorites = favorites.filter(id => id !== product._id);
            showToast('Removed from favorites', 'success');
        } else {
            newFavorites = [...favorites, product._id];
            showToast('Added to favorites', 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
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
        showToast('Link copied to clipboard', 'success');
    };

    // ============ EFFECTS ============

    // Validate Session
    useEffect(() => {
        const validateUrlSession = async () => {
            if (!urlSessionToken || !urlTableNumber) {
                setSessionError('Invalid session');
                setValidatingSession(false);
                return;
            }

            try {
                const success = await initMenuSession(urlSessionToken, urlTableNumber);
                if (!success) {
                    setSessionError('Session expired');
                }
            } catch (err) {
                setSessionError('Failed to validate session');
            } finally {
                setValidatingSession(false);
            }
        };

        validateUrlSession();
    }, [urlSessionToken, urlTableNumber, initMenuSession]);

    // Reset quantity when product changes
    useEffect(() => {
        setQuantity(1);
        setSelectedImage(0);
    }, [productId]);

    // Check favorites
    useEffect(() => {
        if (product) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favorites.includes(product._id));
        }
    }, [product]);

    // ============ RENDER STATES ============

    if (validatingSession) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#5F6754] animate-spin mx-auto mb-3" />
                    <p className="text-[#5F6754] text-sm tracking-wider">Loading...</p>
                </div>
            </div>
        );
    }

    if (sessionError || sessionValid === false) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Session Expired</h2>
                    <p className="text-gray-600 text-sm mb-8">
                        Please scan the QR code again to continue.
                    </p>
                </div>
            </div>
        );
    }

    if (menuLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#5F6754] animate-spin mx-auto mb-3" />
                    <p className="text-[#5F6754] text-sm tracking-wider">Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <X className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Item Not Found</h2>
                    <p className="text-gray-600 mb-6 text-sm">This item is not available</p>
                    <Link
                        href={`/s/${urlSessionToken}/${urlTableNumber}`}
                        className="inline-flex items-center gap-2 bg-[#5F6754] text-white px-6 py-3 rounded-lg hover:bg-[#4a5143] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Menu
                    </Link>
                </div>
            </div>
        );
    }

    // ============ MAIN RENDER ============

    return (
        <div className="min-h-screen bg-white">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

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
                        src={product.image[selectedImage]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}

            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-40 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/s/${urlSessionToken}/${urlTableNumber}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#5F6754] transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-[#5F6754]/10 flex items-center justify-center transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="text-sm uppercase tracking-wider font-medium hidden sm:inline">Back</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {/* Table Badge */}
                            <div className="hidden sm:flex items-center gap-1.5 bg-[#5F6754]/10 border border-[#5F6754]/20 px-3 py-1.5 rounded-full">
                                <div className="w-1.5 h-1.5 bg-[#5F6754] rounded-full" />
                                <span className="text-xs font-semibold text-[#5F6754] uppercase tracking-wider">
                                    Table {menuTableNumber}
                                </span>
                            </div>

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

                            {/* Cart Button */}
                            {cart.length > 0 && (
                                <Link
                                    href={`/s/${urlSessionToken}/${urlTableNumber}`}
                                    className="relative bg-gray-100 hover:bg-emerald-500 text-[#5F6754] hover:text-white p-2.5 rounded-full transition-all shadow-md ml-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white">
                                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                </Link>
                            )}
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
                                        src={product.image[selectedImage]}
                                        alt={product.name}
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
                                
                                {product.bestseller && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-[#5F6754] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-medium">Featured</span>
                                        </div>
                                    </div>
                                )}

                                {cartItem && (
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <Check className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{cartItem.quantity} in cart</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.image.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.image.map((img, index) => (
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
                                            alt={`${product.name} view ${index + 1}`}
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
                                {product.name}
                            </h1>
                            <p className="text-3xl sm:text-4xl font-light text-[#5F6754]">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                                About This Dish
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
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
                            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">
                                Quantity
                            </h2>
                            <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-md bg-white hover:bg-[#5F6754] hover:text-white border border-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-xl font-light w-10 text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= 99}
                                    className="w-10 h-10 rounded-md bg-white hover:bg-[#5F6754] hover:text-white border border-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="bg-[#5F6754]/5 p-5 rounded-lg border border-[#5F6754]/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">
                                        Total
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {quantity} × ${product.price.toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-3xl font-light text-[#5F6754]">
                                    ${(product.price * quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-full py-4 rounded-lg font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl bg-[#5F6754] text-white hover:bg-[#4a5143] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Adding...
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
                {relatedProducts.length > 0 && (
                    <div className="mt-16 sm:mt-20">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                                You Might Also Like
                            </h2>
                            <p className="text-gray-500 text-sm">Explore more options</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((item) => (
                                <RelatedProductCard
                                    key={item._id}
                                    menu={item}
                                    sessionToken={urlSessionToken}
                                    tableNumber={urlTableNumber}
                                />
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
                @keyframes slide-in-from-top-2 {
                    from { transform: translateY(-50%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-in {
                    animation-fill-mode: both;
                }
                .slide-in-from-top-2 {
                    animation-name: slide-in-from-top-2;
                }
                .fade-in {
                    animation-name: fade-in;
                }
                .duration-300 {
                    animation-duration: 300ms;
                }
            `}</style>
        </div>
    );
};

export default ProductDetailPage;