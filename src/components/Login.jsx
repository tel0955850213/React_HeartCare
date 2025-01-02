import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

export default function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('發送登入請求:', credentials);
        
        try {
            const success = await login(credentials.username, credentials.password);
            console.log('登入響應:', success);
            
            if (success) {
                if (success.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError('登入失敗');
            }
        } catch (error) {
            console.error('登入錯誤:', error);
            setError(error.response?.data?.message || '登入失敗');
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <h2>登入</h2>
                <InputGroup>
                    <input
                        type="text"
                        placeholder="帳號"
                        value={credentials.username}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            username: e.target.value
                        })}
                    />
                </InputGroup>
                <InputGroup>
                    <input
                        type="password"
                        placeholder="密碼"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            password: e.target.value
                        })}
                    />
                </InputGroup>
                <LoginButton type="submit">登入</LoginButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    還沒有帳號？ <Link to="/register">立即註冊</Link>
                </div>
            </LoginForm>
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled.form`
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
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

const LoginButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;

const ErrorMessage = styled.div`
    color: #f44336;
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
`; 