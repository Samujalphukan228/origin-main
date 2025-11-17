"use client";

import { useOrder } from '@/context/OrderContext';
import { useMenu } from '@/context/MenuContext';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    Loader2,
    ChefHat,
    Package,
    RefreshCw,
    ShoppingCart,
    ChevronDown,
    Receipt
} from 'lucide-react';

export default function OrdersPage() {
    const params = useParams();
    const { orders, loading, fetchOrders, getOrderStats } = useOrder();
    const { sessionValid, tableNumber } = useMenu();
    const [refreshing, setRefreshing] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    const urlSessionToken = params.session;
    const urlTableNumber = params.table;

    useEffect(() => {
        if (sessionValid && tableNumber) {
            fetchOrders();
        }
    }, [sessionValid, tableNumber, fetchOrders]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setTimeout(() => setRefreshing(false), 500);
    };

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pending',
                    icon: Clock,
                    color: 'text-yellow-700',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200'
                };
            case 'preparing':
                return {
                    label: 'Preparing',
                    icon: ChefHat,
                    color: 'text-blue-700',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200'
                };
            case 'served':
                return {
                    label: 'Served',
                    icon: CheckCircle,
                    color: 'text-green-700',
                    bg: 'bg-green-50',
                    border: 'border-green-200'
                };
            default:
                return {
                    label: 'Pending',
                    icon: Clock,
                    color: 'text-yellow-700',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200'
                };
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) return 'Today';

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const stats = getOrderStats();

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <Loader2 className="w-10 h-10 text-[#5F6754] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/s/${urlSessionToken}/${urlTableNumber}`}
                                className="text-gray-600 hover:text-[#5F6754] transition-colors p-1 -ml-1"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl sm:text-4xl text-[#5F6754] font-light">
                                    Orders
                                </h1>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                                    Table {tableNumber}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="text-gray-400 hover:text-[#5F6754] transition-colors disabled:opacity-50 p-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            {stats.total > 0 && (
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Package className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-700 font-medium">{stats.total}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                                <ChefHat className="w-4 h-4 text-[#5F6754]" />
                                <span className="text-gray-700 font-medium">{stats.preparing}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-gray-700 font-medium">{stats.served}</span>
                            </div>
                            <span className="text-gray-300 hidden sm:inline">•</span>
                            <div className="hidden sm:flex items-center gap-1">
                                <span className="text-[#5F6754] text-lg font-bold">${stats.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Browse our menu to place your first order
                        </p>
                        <Link
                            href={`/s/${urlSessionToken}/${urlTableNumber}`}
                            className="inline-block bg-[#5F6754] text-white px-8 py-3 rounded-lg hover:bg-[#4a5143] transition-colors"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedOrders.has(order._id);

                            return (
                                <div
                                    key={order._id}
                                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#5F6754]/20 transition-all duration-300"
                                >
                                    {/* Order Header */}
                                    <button
                                        onClick={() => toggleOrder(order._id)}
                                        className="w-full bg-white hover:bg-gray-50 transition-colors p-4 sm:p-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Status Icon */}
                                            <div className={`w-12 h-12 rounded-lg ${statusInfo.bg} flex items-center justify-center flex-shrink-0`}>
                                                <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                                            </div>

                                            {/* Order Info */}
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </h3>
                                                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border} font-medium`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {formatDate(order.createdAt)} • {formatTime(order.createdAt)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            {/* Price & Arrow */}
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <p className="text-lg sm:text-xl font-semibold text-[#5F6754]">
                                                    ${order.totalAmount.toFixed(2)}
                                                </p>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    <div className={`transition-all duration-300 overflow-hidden ${
                                        isExpanded ? 'max-h-[2000px]' : 'max-h-0'
                                    }`}>
                                        <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-5">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Receipt className="w-4 h-4 text-gray-600" />
                                                <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                                                    Items
                                                </h4>
                                            </div>

                                            {/* Items List */}
                                            <div className="space-y-2 mb-4">
                                                {order.items.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-100"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-8 h-8 bg-[#5F6754]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <span className="text-[#5F6754] font-bold text-sm">{item.quantity}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    ${item.price.toFixed(2)} each
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-[#5F6754] text-base ml-3 flex-shrink-0">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Total */}
                                            <div className="pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-medium text-gray-900">Total</span>
                                                    <span className="text-2xl font-bold text-[#5F6754]">
                                                        ${order.totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Floating Menu Button */}
            <Link
                href={`/s/${urlSessionToken}/${urlTableNumber}`}
                className="fixed bottom-6 right-6 bg-white hover:bg-[#5F6754] text-[#5F6754] hover:text-white p-3.5 rounded-full shadow-xl border border-gray-200 hover:border-[#5F6754] transition-all duration-300 z-40"
            >
                <ShoppingCart className="w-5 h-5" />
            </Link>

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
}