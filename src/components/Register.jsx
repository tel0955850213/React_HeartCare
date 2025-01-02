import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'USER'  // 這裡使用字符串 'USER'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/register', 
                formData,
                { withCredentials: true }
            );
            
            if (response.data.status === 200) {
                alert('註冊成功！');
                navigate('/login');
            } else {
                // 檢查是否是 email 重複的錯誤
                if (response.data.message.includes('Duplicate entry') && 
                    response.data.message.includes('email')) {
                    setError('此 Email 已被註冊');
                } else {
                    setError(response.data.message || '註冊失敗');
                }
            }
        } catch (error) {
            console.error('註冊錯誤:', error);
            setError('註冊失敗: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <RegisterContainer>
            <RegisterForm onSubmit={handleSubmit}>
                <h2>註冊帳號</h2>
                <InputGroup>
                    <input
                        type="text"
                        placeholder="使用者名稱"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <input
                        type="password"
                        placeholder="密碼"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <input
                        type="email"
                        placeholder="電子郵件"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </InputGroup>
                <RegisterButton type="submit">註冊</RegisterButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </RegisterForm>
        </RegisterContainer>
    );
};

const RegisterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const RegisterForm = styled.form`
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    h2 {
        text-align: center;
        margin-bottom: 30px;
    }
`;

const InputGroup = styled.div`
    margin-bottom: 20px;

    input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;

        &:focus {
            outline: none;
            border-color: #4CAF50;
        }
    }
`;

const RegisterButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    margin-top: 10px;
`;

export default Register; 