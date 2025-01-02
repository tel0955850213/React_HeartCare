import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateAdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/backend/login" />;
    }

    if (!user?.roles?.includes('ADMIN')) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateAdminRoute; 