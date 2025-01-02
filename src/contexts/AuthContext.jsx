import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                { username, password },
                { withCredentials: true }
            );
            
            if (response.data.status === 200) {
                const userData = response.data.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            }
            return null;
        } catch (error) {
            console.error('登入錯誤:', error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                'http://localhost:8080/api/auth/logout',
                {},
                { withCredentials: true }
            );
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('登出失敗:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 