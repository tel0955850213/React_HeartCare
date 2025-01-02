import styled from 'styled-components';

export const AdminContainer = styled.div`
  padding: 20px;
`;

export const AdminHeader = styled.div`
  margin-bottom: 20px;
`;

export const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f5f5f5;
  }
`;

export const Button = styled.button`
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #1890ff;
  color: white;
  
  &:hover {
    background-color: #40a9ff;
  }
  
  &.primary {
    background-color: #1890ff;
    color: white;
    
    &:hover {
      background-color: #40a9ff;
    }
  }
  
  &.secondary {
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    color: #666;
    
    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }
  
  &.danger {
    background-color: #ff4d4f;
    color: white;
    
    &:hover {
      background-color: #ff7875;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-height: 100px;
`; 