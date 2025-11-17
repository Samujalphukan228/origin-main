"use client";

import { useMenu } from '@/context/MenuContext';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
    Search, X, ChevronUp, Filter, Star, Loader2, Grid3x3, List, 
    TrendingUp, ChevronDown, Check, AlertCircle 
} from 'lucide-react';

// ============ COMPONENTS ============

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
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Menu Card Component (Grid View)
const MenuCard = ({ menu, imageErrors, onImageError }) => {
    const hasError = imageErrors[menu._id];

    return (
        <Link href={`/menu/${menu._id}`} className="block group">
            <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#5F6754]/20 transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {!hasError ? (
                        <img
                            src={menu.image[0]}
                            alt={menu.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
};

// Menu List Item Component
const MenuListItem = ({ menu, imageErrors, onImageError }) => {
    const hasError = imageErrors[menu._id];

    return (
        <Link href={`/menu/${menu._id}`} className="block group">
            <article className="border border-gray-200 rounded-xl p-4 hover:border-[#5F6754]/20 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="flex gap-4 items-center">
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
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
};

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

const MenuPage = () => {
    const { menus, loading, error, filter, setFilter, searchMenus, refreshMenus } = useMenu();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [imageErrors, setImageErrors] = useState({});
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFloatingSearch, setShowFloatingSearch] = useState(false);
    const [isFloatingSearchOpen, setIsFloatingSearchOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
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

    // ============ CALLBACKS ============

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
                if (isDropdownOpen) {
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
    }, [searchQuery, isDropdownOpen, isFloatingSearchOpen, handleClearSearch]);

    // ============ RENDER STATES ============

    if (loading) {
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
        <div className="min-h-screen bg-white pb-10">
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#5F6754] font-light">
                                Menu
                            </h1>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1.5">
                                {displayMenus.length} {displayMenus.length === 1 ? 'item' : 'items'}
                                {debouncedSearch && ` • Searching "${debouncedSearch}"`}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
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
                                />
                            ))}
                        </div>
                    )}
                </section>
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

export default MenuPage;