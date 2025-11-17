// customer-app/context/MenuContext.jsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [socket, setSocket] = useState(null);

    // Session States
    const [sessionToken, setSessionToken] = useState(null);
    const [tableNumber, setTableNumber] = useState(null);
    const [sessionValid, setSessionValid] = useState(false);
    const [sessionData, setSessionData] = useState(null);

    // Cart States
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL 

    // Initialize session from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('sessionToken');
        const savedTable = localStorage.getItem('tableNumber');
        
        if (savedToken && savedTable) {
            console.log('📦 Found saved session, validating...');
            validateSession(savedToken).then((isValid) => {
                if (isValid) {
                    console.log('✅ Saved session is valid');
                    setSessionToken(savedToken);
                    setTableNumber(savedTable);
                    loadCart(savedToken);
                } else {
                    console.log('❌ Saved session expired, clearing...');
                    clearSession();
                }
            });
        }
    }, []);

    // Fetch public menus
    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_URL}/api/menu/public`);

            if (response.data.success) {
                setMenus(response.data.menus);
            }
        } catch (err) {
            console.error('Error fetching menus:', err);
            setError(err.response?.data?.message || 'Failed to load menu items');
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Initialize session
    const initializeSession = useCallback(async (token, table) => {
        try {
            console.log('🔄 Initializing session:', { 
                token: token.substring(0, 20) + '...', 
                table 
            });
            
            // 🔥 FIXED: Changed /api/sessions/ to /api/table-session/
            const response = await axios.get(`${API_URL}/api/table-session/validate/${token}`);
            
            console.log('📡 Validation response:', response.data);
            
            if (response.data.success && response.data.valid) {
                // Save to state
                setSessionToken(token);
                setTableNumber(table);
                setSessionValid(true);
                setSessionData(response.data);
                
                // Save to localStorage
                localStorage.setItem('sessionToken', token);
                localStorage.setItem('tableNumber', table);
                
                // Load cart
                loadCart(token);
                
                console.log('✅ Session initialized successfully');
                return true;
            } else {
                console.log('❌ Session invalid:', response.data.message);
                setSessionValid(false);
                setSessionData(null);
                return false;
            }
        } catch (err) {
            console.error('❌ Session initialization error:', err);
            console.error('Error details:', err.response?.data);
            setSessionValid(false);
            setSessionData(null);
            return false;
        }
    }, [API_URL]);

    // Validate session
    const validateSession = useCallback(async (token) => {
        try {
            // 🔥 FIXED: Changed /api/sessions/ to /api/table-session/
            const response = await axios.get(`${API_URL}/api/table-session/validate/${token}`);
            
            if (response.data.success && response.data.valid) {
                setSessionValid(true);
                setSessionData(response.data);
                return true;
            } else {
                setSessionValid(false);
                setSessionData(null);
                return false;
            }
        } catch (err) {
            console.error('Session validation failed:', err);
            setSessionValid(false);
            setSessionData(null);
            return false;
        }
    }, [API_URL]);

    // Clear session
    const clearSession = useCallback(() => {
        setSessionToken(null);
        setTableNumber(null);
        setSessionValid(false);
        setSessionData(null);
        setCart([]);
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('tableNumber');
        if (sessionToken) {
            localStorage.removeItem(`cart_${sessionToken}`);
        }
    }, [sessionToken]);

    // Load cart from localStorage
    const loadCart = useCallback((token) => {
        const savedCart = localStorage.getItem(`cart_${token}`);
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (err) {
                console.error('Error loading cart:', err);
                setCart([]);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (sessionToken && cart.length > 0) {
            localStorage.setItem(`cart_${sessionToken}`, JSON.stringify(cart));
        }
    }, [cart, sessionToken]);

    // Cart Functions
    const addToCart = useCallback((menuItem) => {
        if (!sessionValid) {
            return { success: false, message: 'Please scan QR code to order' };
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === menuItem._id);
            
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === menuItem._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...menuItem, quantity: 1 }];
            }
        });

        return { success: true, message: 'Added to cart' };
    }, [sessionValid]);

    const removeFromCart = useCallback((menuId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== menuId));
    }, []);

    const updateQuantity = useCallback((menuId, change) => {
        setCart(prevCart => 
            prevCart.map(item => {
                if (item._id === menuId) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        if (sessionToken) {
            localStorage.removeItem(`cart_${sessionToken}`);
        }
    }, [sessionToken]);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const getTotalItems = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Place Order
    const placeOrder = useCallback(async () => {
        if (!sessionValid || !sessionToken) {
            return { success: false, message: 'Invalid session' };
        }

        if (cart.length === 0) {
            return { success: false, message: 'Cart is empty' };
        }

        try {
            const orderData = {
                sessionToken,
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post(`${API_URL}/api/orders/place`, orderData);

            if (response.data.success) {
                setOrders(prev => [response.data.order, ...prev]);
                clearCart();

                return { 
                    success: true, 
                    message: 'Order placed successfully',
                    order: response.data.order
                };
            }

            return { success: false, message: 'Failed to place order' };
        } catch (err) {
            console.error('Error placing order:', err);
            return { 
                success: false, 
                message: err.response?.data?.message || 'Failed to place order' 
            };
        }
    }, [sessionValid, sessionToken, cart, API_URL, clearCart]);

    // Get orders for current session
    const fetchOrders = useCallback(async () => {
        if (!tableNumber) return;

        try {
            const response = await axios.get(`${API_URL}/api/orders/table/${tableNumber}`);
            
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    }, [tableNumber, API_URL]);

    // Initialize Socket.IO
    useEffect(() => {
        const newSocket = io(API_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to server');
            
            if (tableNumber) {
                newSocket.emit('joinTable', tableNumber);
            }
        });

        newSocket.on('menu:refresh', () => {
            console.log('🔄 Menu refresh triggered');
            fetchMenus();
        });

        newSocket.on('menu:approved', (menu) => {
            console.log('✅ New menu approved:', menu);
            fetchMenus();
        });

        newSocket.on('orderStatusUpdated', (order) => {
            console.log('📦 Order status updated:', order);
            setOrders(prev => 
                prev.map(o => o._id === order._id ? order : o)
            );
        });

        newSocket.on('newOrder', (order) => {
            console.log('🆕 New order:', order);
            if (order.tableNumber === tableNumber) {
                setOrders(prev => [order, ...prev]);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [API_URL, tableNumber, fetchMenus]);

    // Fetch menus on mount
    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    // Filter menus
    const filteredMenus = menus.filter((menu) => {
        if (filter === 'bestseller') {
            return menu.bestseller === true;
        }
        return true;
    });

    // Search menus
    const searchMenus = useCallback((query) => {
        if (!query.trim()) return filteredMenus;

        const lowerQuery = query.toLowerCase();
        return filteredMenus.filter(
            (menu) =>
                menu.name.toLowerCase().includes(lowerQuery) ||
                menu.description.toLowerCase().includes(lowerQuery)
        );
    }, [filteredMenus]);

    // Get menu by ID
    const getMenuById = useCallback((id) => {
        return menus.find((menu) => menu._id === id);
    }, [menus]);

    const value = {
        // Menu
        menus: filteredMenus,
        allMenus: menus,
        loading,
        error,
        filter,
        setFilter,
        searchMenus,
        getMenuById,
        refreshMenus: fetchMenus,

        // Session
        sessionToken,
        tableNumber,
        sessionValid,
        sessionData,
        initializeSession,
        validateSession,
        clearSession,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,

        // Orders
        orders,
        placeOrder,
        fetchOrders,

        // Socket
        socket,
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};