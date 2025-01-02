import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const UsersContainer = styled.div`
  padding: 20px;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.danger {
    background-color: #ff4d4f;
    color: white;
  }
`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('獲取用戶列表失敗:', error);
    }
  };

  const handleDisableUser = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/disable`);
      fetchUsers();
    } catch (error) {
      console.error('停用用戶失敗:', error);
    }
  };

  return (
    <UsersContainer>
      <h2>用戶管理</h2>
      <UserTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶名</th>
            <th>Email</th>
            <th>註冊時間</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{user.enabled ? '啟用' : '停用'}</td>
              <td>
                <Button 
                  className="danger"
                  onClick={() => handleDisableUser(user.id)}
                >
                  {user.enabled ? '停用' : '啟用'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </UserTable>
    </UsersContainer>
  );
};

export default AdminUsers; 