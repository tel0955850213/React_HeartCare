import React from 'react';
import AdminNavbar from './AdminNavbar';
import styled from 'styled-components';

const AdminDashboard = () => {
    return (
        <>
            <AdminNavbar />
            <DashboardContainer>
                <Title>後台管理系統</Title>
                {/* 其他儀表板內容 */}
            </DashboardContainer>
        </>
    );
};

const DashboardContainer = styled.div`
    padding: 80px 20px 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
`;

export default AdminDashboard; 