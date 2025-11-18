"use client";

import { useMenu } from '@/context/MenuContext';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Search, X, ChevronUp, Filter, Star, Loader2, Grid3x3, List, 
    TrendingUp, ChevronDown, Check, AlertCircle 
} from 'lucide-react';

// ============ OPTIMIZED COMPONENTS ============

// Memoized Skeleton Loader
const MenuSkeleton = memo(({ viewMode }) => {
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
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
});
MenuSkeleton.displayName = 'MenuSkeleton';

// Optimized Menu Card with Next.js Image
const MenuCard = memo(({ menu }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/menu/${menu._id}`} className="block group" prefetch={false}>
            <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#5F6754]/20 transition-all duration-300 h-full flex flex-col">
                {/* Optimized Image */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {!imageError ? (
                        <Image
                            src={menu.image[0]}
                            alt={menu.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImageError(true)}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-12 h-12 border-2 border-gray-200 rounded-full mx-auto mb-2" />
                                <p className="text-xs text-gray-400">Image unavailable</p>
                            </div>
                        </div>
                    )}

                    {menu.bestseller && (
                        <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 text-xs text-white bg-[#5F6754] px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-medium">Featured</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-[#5F6754] transition-colors mb-2 line-clamp-1">
                        {menu.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                        {menu.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-[#5F6754] text-lg font-semibold">
                            ${menu.price.toFixed(2)}
                        </p>
                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            View details →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
});
MenuCard.displayName = 'MenuCard';

// Optimized List Item
const MenuListItem = memo(({ menu }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/menu/${menu._id}`} className="block group" prefetch={false}>
            <article className="border border-gray-200 rounded-xl p-4 hover:border-[#5F6754]/20 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="flex gap-4 items-center">
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                        {!imageError ? (
                            <Image
                                src={menu.image[0]}
                                alt={menu.name}
                                fill
                                sizes="96px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => setImageError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-gray-200 rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
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
                        <div className="flex items-center justify-between">
                            <p className="text-[#5F6754] font-semibold text-lg">
                                ${menu.price.toFixed(2)}
                            </p>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                                View details →
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
});
MenuListItem.displayName = 'MenuListItem';

// ============ MAIN COMPONENT WITH PAGINATION ============

const ITEMS_PER_PAGE = 12; // Load 12 items at a time

const MenuPage = () => {
    const { menus, loading, error, filter, setFilter, searchMenus, refreshMenus } = useMenu();

    // Core State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('menuViewMode') || 'grid';
        }
        return 'grid';
    });
    const [sortBy, setSortBy] = useState('default');
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    
    // UI State - Combine related states
    const [uiState, setUiState] = useState({
        isSearchFocused: false,
        showFloatingSearch: false,
        isFloatingSearchOpen: false,
        showScrollTop: false,
        isDropdownOpen: false
    });

    // Refs
    const searchInputRef = useRef(null);
    const floatingSearchRef = useRef(null);
    const mainSearchRef = useRef(null);
    const dropdownRef = useRef(null);
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    // Constants
    const sortOptions = [
        { value: 'default', label: 'Default Order', icon: TrendingUp },
        { value: 'name', label: 'Name (A-Z)', icon: Filter },
        { value: 'price-low', label: 'Price: Low to High', icon: ChevronUp },
        { value: 'price-high', label: 'Price: High to Low', icon: ChevronDown },
    ];

    // ============ OPTIMIZED MEMOIZED VALUES ============

    const displayMenus = useMemo(() => {
        let items = debouncedSearch ? searchMenus(debouncedSearch) : menus;

        switch (sortBy) {
            case 'price-low':
                items = [...items].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                items = [...items].sort((a, b) => b.price - a.price);
                break;
            case 'name':
                items = [...items].sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        // Return only visible items for pagination
        return items.slice(0, visibleItems);
    }, [menus, debouncedSearch, sortBy, searchMenus, visibleItems]);

    const totalItems = useMemo(() => {
        const items = debouncedSearch ? searchMenus(debouncedSearch) : menus;
        return items.length;
    }, [menus, debouncedSearch, searchMenus]);

    const hasMore = visibleItems < totalItems;

    // ============ OPTIMIZED CALLBACKS ============

    const updateUIState = useCallback((updates) => {
        setUiState(prev => ({ ...prev, ...updates }));
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        setDebouncedSearch('');
        setVisibleItems(ITEMS_PER_PAGE);
    }, []);

    const loadMore = useCallback(() => {
        setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, totalItems));
    }, [totalItems]);

    // ============ OPTIMIZED EFFECTS ============

    // Debounce search with cleanup
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setVisibleItems(ITEMS_PER_PAGE); // Reset pagination on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Optimized scroll handler with throttling
    useEffect(() => {
        let rafId = null;
        let lastScrollY = 0;

        const handleScroll = () => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const mainSearchRect = mainSearchRef.current?.getBoundingClientRect();
                
                updateUIState({
                    showFloatingSearch: mainSearchRect ? mainSearchRect.bottom < -100 : false,
                    showScrollTop: currentScrollY > 400
                });

                lastScrollY = currentScrollY;
                rafId = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [updateUIState]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    // Reset visible items when filter or sort changes
    useEffect(() => {
        setVisibleItems(ITEMS_PER_PAGE);
    }, [filter, sortBy]);

    // ============ RENDER ============

    if (loading && menus.length === 0) {
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

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Simplified floating buttons code... */}
            
            {/* Header - simplified */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#5F6754] font-light">
                                Menu
                            </h1>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1.5">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                {debouncedSearch && ` • "${debouncedSearch}"`}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-[#5F6754] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                                aria-label="Grid view"
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-white text-[#5F6754] shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                                aria-label="List view"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {/* Search bar - simplified */}
                <section className="mb-10" ref={mainSearchRef}>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 border-b-2 border-gray-200 focus:border-[#5F6754] bg-transparent text-gray-900 placeholder-gray-400 outline-none transition-colors text-base"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5F6754] transition-colors p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter and sort controls - simplified */}
                </section>

                {/* Menu Items with optimized rendering */}
                <section>
                    {displayMenus.length === 0 ? (
                        <div className="text-center py-20">
                            <p>No items found</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayMenus.map((menu) => (
                                <MenuCard key={menu._id} menu={menu} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayMenus.map((menu) => (
                                <MenuListItem key={menu._id} menu={menu} />
                            ))}
                        </div>
                    )}

                    {/* Load more trigger */}
                    {hasMore && (
                        <div ref={loadMoreRef} className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 text-[#5F6754] animate-spin" />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default MenuPage;
