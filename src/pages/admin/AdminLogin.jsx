import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  
  &:focus {
    border-color: #1890ff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #40a9ff;
  }
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const success = await login({
        username: formData.get('username'),
        password: formData.get('password'),
        isAdmin: true // 標記這是管理員登入
      });
      
      if (success) {
        navigate('/backend');
      }
    } catch (error) {
      setError('登入失敗：' + error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>後台管理系統</Title>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <Input
          name="username"
          type="text"
          placeholder="管理員帳號"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="密碼"
          required
        />
        <Button type="submit">登入</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin; 