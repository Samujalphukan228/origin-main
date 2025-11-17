// context/OrderContext.jsx
"use client";


import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import io from "socket.io-client";


const OrderContext = createContext();


export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within OrderProvider");
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [tableNumber, setTableNumber] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // ✅ Get localStorage key for current table
    const getStorageKey = useCallback(() => {
        return `orders_table_${tableNumber}`;
    }, [tableNumber]);

    // ✅ Load orders from localStorage on mount
    useEffect(() => {
        if (!tableNumber) return;

        const storageKey = getStorageKey();
        const storedOrders = localStorage.getItem(storageKey);

        if (storedOrders) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                setOrders(parsedOrders);
                console.log("📦 Loaded orders from localStorage:", parsedOrders);
            } catch (error) {
                console.error("❌ Error parsing stored orders:", error);
                localStorage.removeItem(storageKey);
            }
        }
    }, [tableNumber, getStorageKey]);

    // ✅ Save orders to localStorage whenever they change
    useEffect(() => {
        if (!tableNumber) return;

        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(orders));
        console.log("💾 Saved orders to localStorage:", orders);
    }, [orders, tableNumber, getStorageKey]);

    // ✅ Initialize Socket.IO
    useEffect(() => {
        if (!tableNumber) return;

        const newSocket = io(API_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
            newSocket.emit("joinTable", tableNumber);
        });

        // ✅ Listen for new order confirmation
        newSocket.on("newOrder", (data) => {
            console.log("📢 New order received:", data);
            if (data.tableNumber === parseInt(tableNumber)) {
                setOrders((prev) => {
                    // Avoid duplicates
                    const exists = prev.some(order => order._id === data._id);
                    if (exists) return prev;
                    return [data, ...prev];
                });
                toast.success("🎉 Order placed successfully!", {
                    duration: 3000,
                    icon: "✅",
                });
            }
        });

        // ✅ Listen for order status updates
        newSocket.on("orderStatusUpdated", (data) => {
            console.log("📢 Order status updated:", data);
            if (data.tableNumber === parseInt(tableNumber)) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === data._id
                            ? { ...order, status: data.status, updatedAt: data.updatedAt }
                            : order
                    )
                );

                // Different toast messages based on status
                const statusMessages = {
                    pending: "⏳ Order received - Waiting for kitchen",
                    preparing: "👨‍🍳 Your order is being prepared!",
                    served: "✅ Your order has been served!"
                };

                toast.success(statusMessages[data.status] || `Order status: ${data.status}`, {
                    duration: 4000,
                });
            }
        });

        // ✅ Listen for order cancellation
        newSocket.on("orderCancelled", (data) => {
            console.log("📢 Order cancelled:", data);
            if (data.tableNumber === parseInt(tableNumber)) {
                setOrders((prev) => prev.filter((order) => order._id !== data._id));
                toast.error("Order cancelled", {
                    duration: 3000,
                });
            }
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [tableNumber, API_URL]);

    // ✅ Fetch orders from localStorage (no API call)
    const fetchOrders = useCallback(() => {
        if (!tableNumber) return;

        const storageKey = getStorageKey();
        const storedOrders = localStorage.getItem(storageKey);

        if (storedOrders) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                setOrders(parsedOrders);
                console.log("📦 Refreshed orders from localStorage");
            } catch (error) {
                console.error("❌ Error parsing stored orders:", error);
                setOrders([]);
            }
        } else {
            setOrders([]);
        }
    }, [tableNumber, getStorageKey]);

    // ✅ Place order
    const placeOrder = async (cartItems) => {
        if (!sessionToken) {
            toast.error("Please scan QR code to start session");
            return { success: false, message: "No active session" };
        }

        if (!cartItems || cartItems.length === 0) {
            toast.error("Cart is empty");
            return { success: false, message: "Cart is empty" };
        }

        setLoading(true);
        try {
            const orderData = {
                sessionToken,
                items: cartItems.map(({ name, price, quantity }) => ({
                    name,
                    price,
                    quantity,
                })),
            };

            const response = await axios.post(
                `${API_URL}/api/order/place`,
                orderData
            );

            if (response.data.success) {
                // Add order immediately to localStorage
                const newOrder = response.data.order;
                setOrders((prev) => {
                    const exists = prev.some(order => order._id === newOrder._id);
                    if (exists) return prev;
                    return [newOrder, ...prev];
                });

                return {
                    success: true,
                    message: "Order placed successfully!",
                    order: newOrder
                };
            }
        } catch (error) {
            console.error("❌ Place order error:", error);
            const errorMessage = error.response?.data?.message || "Failed to place order";
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // ✅ Set session info and load orders from localStorage
    const initializeSession = useCallback((token, table) => {
        setSessionToken(token);
        setTableNumber(table);

        // Load orders from localStorage for this table
        const storageKey = `orders_table_${table}`;
        const storedOrders = localStorage.getItem(storageKey);

        if (storedOrders) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                setOrders(parsedOrders);
            } catch (error) {
                console.error("❌ Error loading orders:", error);
                setOrders([]);
            }
        }
    }, []);

    // ✅ Clear session and localStorage
    const clearSession = useCallback(() => {
        if (tableNumber) {
            const storageKey = getStorageKey();
            localStorage.removeItem(storageKey);
        }

        setSessionToken(null);
        setTableNumber(null);
        setOrders([]);
    }, [tableNumber, getStorageKey]);

    // ✅ Clear all orders from localStorage
    const clearOrders = useCallback(() => {
        if (!tableNumber) return;

        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        setOrders([]);
        toast.success("Orders cleared");
    }, [tableNumber, getStorageKey]);

    // ✅ Get order statistics
    const getOrderStats = useCallback(() => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            preparing: orders.filter(o => o.status === 'preparing').length,
            served: orders.filter(o => o.status === 'served').length,
            totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        };
        return stats;
    }, [orders]);

    const value = {
        // Orders
        orders,
        loading,
        placeOrder,
        fetchOrders,
        clearOrders,
        getOrderStats,

        // Session
        sessionToken,
        tableNumber,
        initializeSession,
        clearSession,

        // Socket
        socket,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
