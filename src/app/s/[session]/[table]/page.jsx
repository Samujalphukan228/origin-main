"use client";

import { useMenu } from '@/context/MenuContext';
import { useOrder } from '@/context/OrderContext';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Search, X, ChevronUp, Filter, Star, Loader2, ShoppingCart,
    Plus, Minus, Trash2, Check, AlertCircle, Clock, Package,
    ChevronDown, TrendingUp, Eye, ArrowLeft, Grid3x3, List
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

// Session Warning Banner
const SessionWarning = ({ formatTime, onCheckout, hasCart }) => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                        Session expires in {formatTime}
                    </span>
                </div>
                {hasCart && (
                    <button
                        onClick={onCheckout}
                        className="bg-white text-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50 active:scale-95 transition-all shadow-lg"
                    >
                        Checkout Now
                    </button>
                )}
            </div>
        </div>
    </div>
);

// Skeleton Loader
const MenuSkeleton = ({ viewMode }) => {
    const items = Array.from({ length: 6 }, (_, i) => i);
    
    if (viewMode === 'list') {
        return (
            <div className="space-y-3">
                {items.map((i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg" />
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-5">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                        <div className="h-11 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Menu Card Component (Grid View)
const MenuCard = ({ menu, imageErrors, onImageError, onAddToCart, cartItems, sessionToken, tableNumber }) => {
    const hasError = imageErrors[menu._id];
    const inCart = cartItems.find(item => item._id === menu._id);

    return (
        <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#5F6754]/30 transition-all duration-300 h-full flex flex-col group">
            {/* Image */}
            <Link href={`/s/${sessionToken}/${tableNumber}/menu/${menu._id}`} className="block">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {!hasError ? (
                        <img
                            src={menu.image[0]}
                            alt={menu.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => onImageError(menu._id)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-12 h-12 border-2 border-gray-200 rounded-full mx-auto mb-2" />
                                <p className="text-xs text-gray-400">Image unavailable</p>
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {menu.bestseller && (
                            <div className="flex items-center gap-1 text-xs text-white bg-[#5F6754] px-2.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-medium">Featured</span>
                            </div>
                        )}
                        {inCart && (
                            <div className="flex items-center gap-1 text-xs text-white bg-emerald-500 px-2.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                <Check className="w-3 h-3" />
                                <span className="font-medium">{inCart.quantity} in cart</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white text-[#5F6754] px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <Link href={`/s/${sessionToken}/${tableNumber}/menu/${menu._id}`} className="flex-1 mb-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#5F6754] transition-colors line-clamp-1">
                            {menu.name}
                        </h3>
                        <p className="text-[#5F6754] text-lg font-bold whitespace-nowrap">
                            ${menu.price.toFixed(2)}
                        </p>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {menu.description}
                    </p>
                </Link>

                {/* Add to Cart Button */}
                <button
                    onClick={(e) => onAddToCart(menu, e)}
                    className="w-full bg-[#5F6754] text-white px-4 py-3 rounded-lg hover:bg-[#4a5143] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </article>
    );
};

// Menu List Item Component
const MenuListItem = ({ menu, imageErrors, onImageError, onAddToCart, cartItems, sessionToken, tableNumber }) => {
    const hasError = imageErrors[menu._id];
    const inCart = cartItems.find(item => item._id === menu._id);

    return (
        <article className="border border-gray-200 rounded-xl p-4 hover:border-[#5F6754]/20 hover:shadow-lg transition-all duration-300 bg-white group">
            <div className="flex gap-4 items-start">
                {/* Image */}
                <Link href={`/s/${sessionToken}/${tableNumber}/menu/${menu._id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 relative">
                        {!hasError ? (
                            <img
                                src={menu.image[0]}
                                alt={menu.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => onImageError(menu._id)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-gray-200 rounded-full" />
                            </div>
                        )}
                        {inCart && (
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-lg">
                                {inCart.quantity}
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <Link href={`/s/${sessionToken}/${tableNumber}/menu/${menu._id}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-[#5F6754] transition-colors truncate">
                                {menu.name}
                            </h3>
                            {menu.bestseller && (
                                <div className="flex items-center gap-1 text-xs text-[#5F6754] bg-[#5F6754]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="hidden sm:inline font-medium">Featured</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2 leading-relaxed">
                            {menu.description}
                        </p>
                    </Link>
                    
                    <div className="flex items-center justify-between gap-3 mt-3">
                        <p className="text-[#5F6754] font-semibold text-lg">
                            ${menu.price.toFixed(2)}
                        </p>
                        <button
                            onClick={(e) => onAddToCart(menu, e)}
                            className="bg-[#5F6754] text-white px-4 py-2 rounded-lg hover:bg-[#4a5143] active:scale-95 transition-all flex items-center gap-1.5 text-sm font-medium shadow-md"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#5F6754]/20 transition-all group">
        <div className="flex gap-4">
            {/* Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {item.name}
                    </h3>
                    <button
                        onClick={() => onRemove(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                        aria-label="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-base font-bold text-[#5F6754] mb-3">
                    ${(item.price * item.quantity).toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal ml-2">
                        (${item.price.toFixed(2)} each)
                    </span>
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1.5 w-fit border border-gray-200">
                    <button
                        onClick={() => onUpdateQuantity(item._id, -1)}
                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-[#5F6754] hover:text-[#5F6754] transition-all active:scale-95 shadow-sm"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => onUpdateQuantity(item._id, 1)}
                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-[#5F6754] hover:text-[#5F6754] transition-all active:scale-95 shadow-sm"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Empty State Component
const EmptyState = ({ searchQuery, onClearSearch }) => (
    <div className="text-center py-20 px-4">
        <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
            {searchQuery ? (
                <Search className="w-10 h-10 text-gray-300" />
            ) : (
                <AlertCircle className="w-10 h-10 text-gray-300" />
            )}
        </div>
        <h3 className="text-xl text-gray-900 mb-2 font-medium">
            {searchQuery ? 'No items found' : 'No menu items available'}
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            {searchQuery
                ? `We couldn't find any items matching "${searchQuery}". Try different keywords.`
                : 'Check back later for delicious menu items.'}
        </p>
        {searchQuery && (
            <button
                onClick={onClearSearch}
                className="bg-[#5F6754] text-white px-6 py-2.5 rounded-lg hover:bg-[#4a5143] transition-colors text-sm font-medium"
            >
                Clear Search
            </button>
        )}
    </div>
);

// ============ MAIN COMPONENT ============

const TableOrderingPage = () => {
    const params = useParams();
    const router = useRouter();

    const urlSessionToken = params.session;
    const urlTableNumber = params.table;

    const {
        menus,
        loading: menuLoading,
        error,
        filter,
        setFilter,
        searchMenus,
        refreshMenus,
        sessionToken: menuSessionToken,
        tableNumber: menuTableNumber,
        sessionValid,
        sessionData,
        initializeSession: initMenuSession,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
    } = useMenu();

    const {
        orders,
        placeOrder: placeOrderAPI,
        fetchOrders,
        initializeSession: initOrderSession,
    } = useOrder();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [imageErrors, setImageErrors] = useState({});
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFloatingSearch, setShowFloatingSearch] = useState(false);
    const [isFloatingSearchOpen, setIsFloatingSearchOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [validatingSession, setValidatingSession] = useState(true);
    const [sessionError, setSessionError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [toast, setToast] = useState(null);
    
    // Get saved view mode from localStorage or default to 'grid'
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('menuViewMode') || 'grid';
        }
        return 'grid';
    });

    // Refs
    const searchInputRef = useRef(null);
    const floatingSearchRef = useRef(null);
    const mainSearchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Constants
    const sortOptions = [
        { value: 'default', label: 'Default Order', icon: TrendingUp },
        { value: 'name', label: 'Name (A-Z)', icon: Filter },
        { value: 'price-low', label: 'Price: Low to High', icon: ChevronUp },
        { value: 'price-high', label: 'Price: High to Low', icon: ChevronDown },
    ];

    // ============ MEMOIZED VALUES ============

    const displayMenus = useMemo(() => {
        let items = debouncedSearch ? searchMenus(debouncedSearch) : menus;

        switch (sortBy) {
            case 'price-low':
                return [...items].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...items].sort((a, b) => b.price - a.price);
            case 'name':
                return [...items].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return items;
        }
    }, [menus, debouncedSearch, sortBy, searchMenus]);

    const currentSortOption = useMemo(
        () => sortOptions.find(option => option.value === sortBy),
        [sortBy]
    );

    const filterCounts = useMemo(() => ({
        all: menus.length,
        bestseller: menus.filter(m => m.bestseller).length
    }), [menus]);

    const formattedTimeRemaining = useMemo(() => {
        if (!timeRemaining || timeRemaining <= 0) return 'Expired';
        
        const totalSeconds = Math.floor(timeRemaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }, [timeRemaining]);

    const expiryStatus = useMemo(() => {
        if (!timeRemaining) return { 
            color: 'text-gray-600', 
            bg: 'bg-gray-100', 
            textColor: 'text-gray-700',
            borderColor: 'border-gray-200',
            pulse: false
        };
        
        const minutes = Math.floor(timeRemaining / 60000);
        
        if (minutes <= 5) return { 
            color: 'text-red-600', 
            bg: 'bg-red-50', 
            borderColor: 'border-red-300',
            textColor: 'text-red-700',
            pulse: true
        };
        if (minutes <= 15) return { 
            color: 'text-orange-600', 
            bg: 'bg-orange-50', 
            borderColor: 'border-orange-300',
            textColor: 'text-orange-700',
            pulse: false
        };
        return { 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            borderColor: 'border-emerald-300',
            textColor: 'text-emerald-700',
            pulse: false
        };
    }, [timeRemaining]);

    // ============ CALLBACKS ============

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleImageError = useCallback((menuId) => {
        setImageErrors(prev => ({ ...prev, [menuId]: true }));
    }, []);

    const handleClearSearch = useCallback((e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setSearchQuery('');
        setDebouncedSearch('');
        setTimeout(() => searchInputRef.current?.focus(), 0);
    }, []);

    const handleAddToCart = useCallback((menu, e) => {
        e?.preventDefault();
        e?.stopPropagation();

        const result = addToCart(menu);
        if (result.success) {
            showToast(`${menu.name} added to cart`, 'success');
        } else {
            showToast(result.message, 'error');
        }
    }, [addToCart, showToast]);

    const handlePlaceOrder = useCallback(async () => {
        if (cart.length === 0) return;

        try {
            setPlacingOrder(true);
            const result = await placeOrderAPI(cart);

            if (result.success) {
                showToast('Order placed successfully!', 'success');
                clearCart();
                setTimeout(() => setShowCart(false), 1500);
                await fetchOrders();
            } else {
                showToast(result.message || 'Failed to place order', 'error');
            }
        } catch (err) {
            showToast('Failed to place order', 'error');
        } finally {
            setPlacingOrder(false);
        }
    }, [cart, placeOrderAPI, clearCart, showToast, fetchOrders]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFloatingSearchToggle = useCallback((e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsFloatingSearchOpen(prev => !prev);
    }, []);

    const handleFilterChange = useCallback((newFilter) => {
        if (filter !== newFilter) {
            setFilter(newFilter);
        }
    }, [filter, setFilter]);

    const handleSortChange = useCallback((value) => {
        setSortBy(value);
        setIsDropdownOpen(false);
    }, []);

    const handleViewModeChange = useCallback((mode) => {
        setViewMode(mode);
        localStorage.setItem('menuViewMode', mode);
    }, []);

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
                if (success) {
                    initOrderSession(urlSessionToken, urlTableNumber);
                } else {
                    setSessionError('Session expired');
                }
            } catch (err) {
                setSessionError('Failed to validate session');
            } finally {
                setValidatingSession(false);
            }
        };

        validateUrlSession();
    }, [urlSessionToken, urlTableNumber, initMenuSession, initOrderSession]);

    // Fetch Orders
    useEffect(() => {
        if (sessionValid && menuTableNumber) {
            fetchOrders();
        }
    }, [sessionValid, menuTableNumber, fetchOrders]);

    // Session Timer
    useEffect(() => {
        if (!sessionData?.expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expiryTime = new Date(sessionData.expiresAt).getTime();
            const remaining = expiryTime - now;

            if (remaining <= 0) {
                setSessionExpired(true);
                setTimeRemaining(0);
                return false;
            }

            setTimeRemaining(remaining);
            setShowSessionWarning(Math.floor(remaining / 60000) <= 5);
            return true;
        };

        const shouldContinue = updateTimer();
        if (!shouldContinue) return;

        const interval = setInterval(() => {
            if (!updateTimer()) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionData?.expiresAt]);

    // Handle Session Expiry
    useEffect(() => {
        if (sessionExpired) {
            showToast('Session expired. Please scan QR code again.', 'error');
            setTimeout(() => window.location.reload(), 2000);
        }
    }, [sessionExpired, showToast]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle scroll for floating elements
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const mainSearchRect = mainSearchRef.current?.getBoundingClientRect();
                    setShowFloatingSearch(mainSearchRect ? mainSearchRect.bottom < -100 : false);
                    setShowScrollTop(window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-focus floating search
    useEffect(() => {
        if (isFloatingSearchOpen && floatingSearchRef.current) {
            const timer = setTimeout(() => floatingSearchRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isFloatingSearchOpen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd/Ctrl + K to focus search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Escape key handling
            if (e.key === 'Escape') {
                if (showCart) {
                    setShowCart(false);
                } else if (isDropdownOpen) {
                    setIsDropdownOpen(false);
                } else if (isFloatingSearchOpen) {
                    setIsFloatingSearchOpen(false);
                } else if (searchQuery) {
                    handleClearSearch();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showCart, searchQuery, isDropdownOpen, isFloatingSearchOpen, handleClearSearch]);

    // ============ RENDER STATES ============

    if (validatingSession) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-[#5F6754]/10 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-[#5F6754] animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Validating Session</h3>
                    <p className="text-sm text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    if (sessionError || sessionValid === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Session Expired</h2>
                    <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        Your session has expired. Please scan the QR code again to continue ordering.
                    </p>
                    {sessionExpired && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Reloading...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (menuLoading) {
        return (
            <div className="min-h-screen bg-white">
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#5F6754] font-light">Menu</h1>
                                <div className="h-4 w-20 bg-gray-200 rounded mt-2 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <MenuSkeleton viewMode={viewMode} />
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={refreshMenus}
                        className="bg-[#5F6754] text-white px-8 py-3 rounded-lg hover:bg-[#4a5143] transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ============ MAIN RENDER ============

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Session Warning */}
            {showSessionWarning && !sessionExpired && (
                <SessionWarning
                    formatTime={formattedTimeRemaining}
                    onCheckout={() => setShowCart(true)}
                    hasCart={cart.length > 0}
                />
            )}

            {/* Floating Buttons */}
            <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
                {/* Floating Search */}
                <div className={`transition-all duration-300 ${
                    showFloatingSearch ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}>
                    {isFloatingSearchOpen ? (
                        <div className="flex items-center gap-2 bg-white rounded-full shadow-xl border border-gray-200 p-2">
                            <Search className="w-4 h-4 text-gray-400 ml-2" />
                            <input
                                ref={floatingSearchRef}
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-40 sm:w-52 px-2 py-2 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-1.5 text-gray-400 hover:text-[#5F6754] transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={handleFloatingSearchToggle}
                                className="p-2 bg-[#5F6754] text-white rounded-full hover:bg-[#4a5143] transition-colors"
                                aria-label="Close search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleFloatingSearchToggle}
                            className="bg-white hover:bg-[#5F6754] text-[#5F6754] hover:text-white p-3.5 rounded-full shadow-xl border border-gray-200 hover:border-[#5F6754] transition-all duration-300"
                            aria-label="Open search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Scroll to Top */}
                <button
                    onClick={scrollToTop}
                    className={`bg-white hover:bg-[#5F6754] text-[#5F6754] hover:text-white p-3.5 rounded-full shadow-xl border border-gray-200 hover:border-[#5F6754] transition-all duration-300 ${
                        showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                    }`}
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            </div>

            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#5F6754] font-light">
                                Menu
                            </h1>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <div className="flex items-center gap-1.5 bg-[#5F6754]/10 border border-[#5F6754]/20 px-2.5 py-1 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-[#5F6754] rounded-full" />
                                    <span className="text-xs font-semibold text-[#5F6754] uppercase tracking-wider">
                                        Table {menuTableNumber}
                                    </span>
                                </div>
                                
                                {/* Mobile Timer */}
                                {timeRemaining && (
                                    <div className={`sm:hidden flex items-center gap-1.5 ${expiryStatus.bg} ${expiryStatus.borderColor} border px-2.5 py-1 rounded-full ${
                                        expiryStatus.pulse ? 'animate-pulse' : ''
                                    }`}>
                                        <Clock className={`w-3 h-3 ${expiryStatus.color}`} />
                                        <span className={`text-xs font-semibold ${expiryStatus.textColor}`}>
                                            {formattedTimeRemaining}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Right Side */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Desktop Timer */}
                            {timeRemaining && (
                                <div className={`hidden sm:flex items-center gap-2 ${expiryStatus.bg} ${expiryStatus.borderColor} border px-4 py-2.5 rounded-xl transition-all ${
                                    expiryStatus.pulse ? 'animate-pulse' : ''
                                }`}>
                                    <Clock className={`w-4 h-4 ${expiryStatus.color}`} />
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${expiryStatus.textColor} leading-none`}>
                                            {formattedTimeRemaining}
                                        </span>
                                        <span className="text-[10px] text-gray-500 leading-none mt-0.5">
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* View Toggle */}
                            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => handleViewModeChange('grid')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'grid'
                                            ? 'bg-white text-[#5F6754] shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    aria-label="Grid view"
                                    aria-pressed={viewMode === 'grid'}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleViewModeChange('list')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-white text-[#5F6754] shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    aria-label="List view"
                                    aria-pressed={viewMode === 'list'}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Orders Button */}
                            {orders.length > 0 && (
                                <Link
                                    href={`/s/${urlSessionToken}/${urlTableNumber}/orders`}
                                    className="flex items-center gap-2 bg-[#5F6754] text-white px-3 sm:px-4 py-2.5 rounded-xl hover:bg-[#4a5143] active:scale-95 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Package className="w-4 h-4" />
                                    <span className="hidden sm:inline text-sm font-semibold">Orders</span>
                                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-white text-[#5F6754] rounded-full text-xs font-bold">
                                        {orders.length}
                                    </span>
                                </Link>
                            )}

                            {/* Cart Button */}
                            {cart.length > 0 && (
                                <button
                                    onClick={() => setShowCart(true)}
                                    className="relative bg-gray-100 hover:bg-emerald-500 text-[#5F6754] hover:text-white p-2.5 sm:p-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                                    aria-label="View cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white">
                                        {getTotalItems()}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* Search & Filters */}
                <section className="mb-10" ref={mainSearchRef}>
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                isSearchFocused || searchQuery ? 'text-[#5F6754]' : 'text-gray-400'
                            }`} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search menu... (⌘K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full pl-12 pr-12 py-3.5 border-b-2 border-gray-200 focus:border-[#5F6754] bg-transparent text-gray-900 placeholder-gray-400 outline-none transition-colors text-base"
                                aria-label="Search menu items"
                            />
                            {searchQuery && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {searchQuery !== debouncedSearch && (
                                        <Loader2 className="w-4 h-4 text-[#5F6754] animate-spin" />
                                    )}
                                    <button
                                        onClick={handleClearSearch}
                                        className="text-gray-400 hover:text-[#5F6754] transition-colors p-1"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            <div className={`absolute bottom-0 left-0 h-0.5 bg-[#5F6754] origin-left transition-all duration-500 ${
                                isSearchFocused ? 'scale-x-100' : 'scale-x-0'
                            }`} style={{ width: '100%' }} />
                        </div>
                    </div>

                    {/* Filters & Sort */}
                    <div className="space-y-6">
                        {/* Filter Tabs */}
                        <div className="flex items-center justify-center gap-10">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`relative pb-2 transition-colors ${
                                    filter === 'all' ? 'text-[#5F6754] font-medium' : 'text-gray-400 hover:text-gray-700'
                                }`}
                                aria-pressed={filter === 'all'}
                            >
                                <span className="text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    All
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{filterCounts.all}</span>
                                </span>
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6754] transition-transform ${
                                    filter === 'all' ? 'scale-x-100' : 'scale-x-0'
                                }`} />
                            </button>

                            <button
                                onClick={() => handleFilterChange('bestseller')}
                                className={`relative pb-2 transition-colors ${
                                    filter === 'bestseller' ? 'text-[#5F6754] font-medium' : 'text-gray-400 hover:text-gray-700'
                                }`}
                                aria-pressed={filter === 'bestseller'}
                            >
                                <span className="text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Star className={`w-4 h-4 ${filter === 'bestseller' ? 'fill-current' : ''}`} />
                                    Featured
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{filterCounts.bestseller}</span>
                                </span>
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6754] transition-transform ${
                                    filter === 'bestseller' ? 'scale-x-100' : 'scale-x-0'
                                }`} />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xs" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 hover:border-[#5F6754] focus:border-[#5F6754] focus:outline-none focus:ring-2 focus:ring-[#5F6754]/20 transition-all"
                                    aria-haspopup="listbox"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <div className="flex items-center gap-2">
                                        {currentSortOption && (
                                            <>
                                                <currentSortOption.icon className="w-4 h-4 text-[#5F6754]" />
                                                <span className="font-medium">{currentSortOption.label}</span>
                                            </>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-40" role="listbox">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortChange(option.value)}
                                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                                                    sortBy === option.value
                                                        ? 'bg-[#5F6754] text-white'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                                role="option"
                                                aria-selected={sortBy === option.value}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <option.icon className={`w-4 h-4 ${
                                                        sortBy === option.value ? 'text-white' : 'text-[#5F6754]'
                                                    }`} />
                                                    <span className="font-medium">{option.label}</span>
                                                </div>
                                                {sortBy === option.value && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Menu Items */}
                <section>
                    {displayMenus.length === 0 ? (
                        <EmptyState searchQuery={searchQuery} onClearSearch={handleClearSearch} />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayMenus.map((menu) => (
                                <MenuCard
                                    key={menu._id}
                                    menu={menu}
                                    imageErrors={imageErrors}
                                    onImageError={handleImageError}
                                    onAddToCart={handleAddToCart}
                                    cartItems={cart}
                                    sessionToken={urlSessionToken}
                                    tableNumber={urlTableNumber}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayMenus.map((menu) => (
                                <MenuListItem
                                    key={menu._id}
                                    menu={menu}
                                    imageErrors={imageErrors}
                                    onImageError={handleImageError}
                                    onAddToCart={handleAddToCart}
                                    cartItems={cart}
                                    sessionToken={urlSessionToken}
                                    tableNumber={urlTableNumber}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setShowCart(false)} 
                    />

                    {/* Sidebar */}
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Cart Header */}
                        <div className="bg-gradient-to-r from-[#5F6754] to-[#4a5143] text-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">Your Cart</h2>
                                    <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
                                        <div className="w-1 h-1 bg-white/60 rounded-full" />
                                        Table {menuTableNumber}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
                                    aria-label="Close cart"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {cart.length > 0 && (
                                <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 w-fit">
                                    <ShoppingCart className="w-4 h-4" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold leading-none">
                                            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                                        </span>
                                        <span className="text-xs text-white/70 leading-none mt-1">
                                            ${getTotalPrice().toFixed(2)} total
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-5">
                                        <ShoppingCart className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h3>
                                    <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                                        Add delicious items from our menu to get started
                                    </p>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="bg-[#5F6754] text-white px-8 py-3 rounded-xl hover:bg-[#4a5143] active:scale-95 transition-all font-semibold shadow-lg flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Browse Menu</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 space-y-3">
                                    {cart.map((item) => (
                                        <CartItem
                                            key={item._id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cart.length > 0 && (
                            <div className="bg-white border-t border-gray-200 p-6 space-y-4 shadow-2xl">
                                {/* Total */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="text-base font-semibold text-gray-700">Total Amount</span>
                                    <span className="text-3xl font-bold text-[#5F6754]">
                                        ${getTotalPrice().toFixed(2)}
                                    </span>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder}
                                    className="w-full bg-gradient-to-r from-[#5F6754] to-[#4a5143] text-white py-4 rounded-xl font-bold hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base shadow-lg"
                                >
                                    {placingOrder ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Placing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Place Order</span>
                                        </>
                                    )}
                                </button>

                                {/* Clear Cart */}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to clear your cart?')) {
                                            clearCart();
                                            showToast('Cart cleared', 'success');
                                        }
                                    }}
                                    className="w-full text-gray-500 hover:text-red-600 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Clear Cart</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                @keyframes slide-in-from-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes slide-in-from-top {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
                @keyframes slide-in-from-top-2 {
                    from { transform: translateY(-50%); }
                    to { transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-in {
                    animation-fill-mode: both;
                }
                .slide-in-from-right {
                    animation-name: slide-in-from-right;
                }
                .slide-in-from-top {
                    animation-name: slide-in-from-top;
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

export default TableOrderingPage;