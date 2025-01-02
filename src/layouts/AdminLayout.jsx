import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #001529;
  color: white;
  padding: 20px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
`;

const Logo = styled.div`
  font-size: 20px;
  color: white;
  margin-bottom: 40px;
  text-align: center;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  margin-bottom: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #1890ff;
  }
  
  &.active {
    background-color: #1890ff;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: white;
  margin-bottom: 20px;
`;

const HeaderButton = styled.button`
  padding: 8px 16px;
  margin-left: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #1890ff;
  color: white;
  
  &:hover {
    background-color: #40a9ff;
  }
  
  &.secondary {
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    color: #666;
    
    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }
`;

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin', label: '儀表板' },
    { path: '/admin/products', label: '商品管理' },
    { path: '/admin/orders', label: '訂單管理' },
    { path: '/admin/users', label: '用戶管理' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AdminLayoutContainer>
      <Sidebar>
        <Logo>後台管理系統</Logo>
        {menuItems.map(item => (
          <MenuItem
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </MenuItem>
        ))}
      </Sidebar>
      <div style={{ flex: 1 }}>
        <Header>
          <HeaderButton className="secondary" onClick={() => navigate('/')}>
            返回前台
          </HeaderButton>
          <HeaderButton onClick={handleLogout}>
            登出
          </HeaderButton>
        </Header>
        <Content>
          {children}
        </Content>
      </div>
    </AdminLayoutContainer>
  );
};

export default AdminLayout; 