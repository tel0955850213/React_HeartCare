import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post('/api/admin/login', credentials);
            if (response.data.role === 'ADMIN') {
                // 登入成功，導向後台
                navigate('/admin/dashboard');
            } else {
                throw new Error('無管理員權限');
            }
        } catch (error) {
            alert('登入失敗：' + error.message);
        }
    };

    return (
        <div>
            {/* 渲染登入表單的 JSX 代碼 */}
        </div>
    );
};

export default AdminLogin; 