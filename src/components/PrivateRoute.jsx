import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>載入中...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
} 