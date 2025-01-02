import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AdminNavbar = () => {
    return (
        <NavContainer>
            <NavItems>
                <AdminNavLink to="/admin">儀表板</AdminNavLink>
                <AdminNavLink to="/admin/products">商品管理</AdminNavLink>
                <AdminNavLink to="/admin/orders">訂單管理</AdminNavLink>
                <AdminNavLink to="/admin/users">用戶管理</AdminNavLink>
                <AdminNavLink to="/admin/statistics">銷售統計</AdminNavLink>
                <BackToFront to="/">返回前台</BackToFront>
            </NavItems>
        </NavContainer>
    );
};

const NavContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #1a1a1a;
    padding: 15px 0;
    z-index: 10;
`;

const NavItems = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const AdminNavLink = styled(Link)`
    color: white;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;

    &:hover {
        background-color: #333;
    }
`;

const BackToFront = styled(AdminNavLink)`
    color: #ff9800;
`;

export default AdminNavbar; 