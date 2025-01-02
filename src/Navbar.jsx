// src/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './context/ThemeContext';
import styled from 'styled-components';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <NavContainer $isDarkMode={isDarkMode}>
            <NavItems>
                {user?.role === 'ADMIN' ? (
                    <>
                        <AdminNavLink to="/admin">儀表板</AdminNavLink>
                        <AdminNavLink to="/admin/products">商品管理</AdminNavLink>
                        <AdminNavLink to="/admin/orders">訂單管理</AdminNavLink>
                        <AdminNavLink to="/admin/users">用戶管理</AdminNavLink>
                        <AdminNavLink to="/admin/statistics">銷售統計</AdminNavLink>
                        <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                    </>
                ) : (
                    <>
                        <NavLink to="/">首頁</NavLink>
                        <NavLink to="/products">商品列表</NavLink>
                        {user && <NavLink to="/cart">購物車</NavLink>}
                        {user && <NavLink to="/orders">我的訂單</NavLink>}
                        {user ? (
                            <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                        ) : (
                            <NavLink to="/login">登入</NavLink>
                        )}
                    </>
                )}
            </NavItems>
            <ThemeToggle 
                $isDarkMode={isDarkMode} 
                onClick={toggleTheme}
                aria-label="切換深色模式"
            />
        </NavContainer>
    );
};

const NavContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${props => props.$isDarkMode ? '#2d2d2d' : '#ffffff'};
    backdrop-filter: blur(20px);
    padding: 15px 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
    transition: all 0.3s ease;
`;

const NavItems = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const NavLink = styled(Link)`
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${props => props.$isDarkMode ? '#444' : '#eee'};
    }
`;

const AdminNavLink = styled(NavLink)`
    color: #0066cc;
    font-weight: bold;

    &:hover {
        background-color: #e6f0ff;
    }
`;

const LogoutButton = styled.button`
    background-color: #0066cc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0055b3;
    }
`;

const ThemeToggle = styled.button`
    width: 48px;
    height: 24px;
    border-radius: 12px;
    background: ${props => props.$isDarkMode ? '#365314' : '#84cc16'};
    position: relative;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 20px;
`;

export default Navbar;
