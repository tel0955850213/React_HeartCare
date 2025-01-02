import React from 'react';
import AdminNavbar from './AdminNavbar';
import styled from 'styled-components';

const AdminStatistics = () => {
    return (
        <>
            <AdminNavbar />
            <Container>
                <Title>銷售統計</Title>
                {/* 銷售統計內容 */}
            </Container>
        </>
    );
};

const Container = styled.div`
    padding: 80px 20px 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
`;

export default AdminStatistics; 