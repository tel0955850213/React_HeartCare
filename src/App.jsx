import React, { useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import UserOrders from './components/UserOrders';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStatistics from './components/admin/AdminStatistics';
import Register from './components/Register';
import ProductManagement from './pages/admin/ProductManagement';
import AdminLayout from './layouts/AdminLayout';
import Orders from './components/Orders';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
    }
`;

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);
    
    return user?.role === 'ADMIN' ? children : null;
};

function App() {
    return (
        <BrowserRouter
            future={{ 
                v7_startTransition: true,
                v7_relativeSplatPath: true 
            }}
        >
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/" element={<>
                                <Navbar />
                                <Home />
                            </>} />
                            <Route path="/products" element={<>
                                <Navbar />
                                <ProductList />
                            </>} />
                            <Route path="/cart" element={<>
                                <Navbar />
                                <Cart />
                            </>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/orders" element={<>
                                <Navbar />
                                <Orders />
                            </>} />

                            <Route path="/admin/*" element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <Routes>
                                            <Route path="/" element={<AdminDashboard />} />
                                            <Route path="/products" element={<AdminProducts />} />
                                            <Route path="/orders" element={<AdminOrders />} />
                                            <Route path="/users" element={<AdminUsers />} />
                                        </Routes>
                                    </AdminLayout>
                                </AdminRoute>
                            } />
                        </Routes>
                        <GlobalStyle />
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
