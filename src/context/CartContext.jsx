import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        setCartItems([]);
    }, [user]);

    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cart_${user.id}`);
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    }, [user]);

    useEffect(() => {
        if (user && cartItems.length > 0) {
            localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = (product) => {
        if (!user) {
            alert('請先登入');
            return;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, {
                id: product.id,
                title: product.name,
                price: product.price,
                image: product.images?.[0]?.imageBase64 || `/images/books/book${product.id}.jpg`,
                quantity: 1
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        if (user) {
            localStorage.removeItem(`cart_${user.id}`);
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 