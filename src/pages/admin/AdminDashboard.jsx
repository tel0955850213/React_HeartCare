import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #666;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    monthlyRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('獲取統計數據失敗:', error);
    }
  };

  return (
    <DashboardContainer>
      <h2>儀表板</h2>
      <StatsGrid>
        <StatCard>
          <StatTitle>總訂單數</StatTitle>
          <StatValue>{stats.totalOrders}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>本月營業額</StatTitle>
          <StatValue>${stats.monthlyRevenue}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>商品總數</StatTitle>
          <StatValue>{stats.totalProducts}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>用戶數量</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
        </StatCard>
      </StatsGrid>

      <h3>最新訂單</h3>
      {/* 這裡可以加入最新訂單列表 */}
    </DashboardContainer>
  );
};

export default AdminDashboard; 