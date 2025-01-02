import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            console.log('正在獲取訂單列表...');
            const response = await axios.get('http://localhost:8080/api/admin/orders', {
                withCredentials: true
            });
            console.log('訂單響應:', response.data);
            if (response.data.status === 200) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('獲取訂單失敗:', error);
            setError('獲取訂單失敗: ' + error.message);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/orders/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            if (response.data.status === 200) {
                fetchOrders(); // 重新獲取訂單列表
                alert('訂單狀態更新成功');
            }
        } catch (error) {
            console.error('更新訂單狀態失敗:', error);
            alert('更新失敗: ' + error.response?.data?.message);
        }
    };

    return (
        <Container>
            <h2>訂單管理</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {orders.length === 0 ? (
                <NoOrders>暫無訂單</NoOrders>
            ) : (
                <OrderList>
                    {orders.map(order => (
                        <OrderCard key={order.id}>
                            <OrderHeader>
                                <span>訂單編號: {order.id}</span>
                                <span>訂單日期: {new Date(order.orderDate).toLocaleString()}</span>
                                <StatusSelect
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                    <option value="PENDING">待處理</option>
                                    <option value="PROCESSING">處理中</option>
                                    <option value="SHIPPED">已出貨</option>
                                    <option value="DELIVERED">已送達</option>
                                    <option value="COMPLETED">已完成</option>
                                    <option value="CANCELLED">已取消</option>
                                </StatusSelect>
                            </OrderHeader>
                            <OrderDetails>
                                <div>收件人: {order.recipientName}</div>
                                <div>地址: {order.shippingAddress}</div>
                                <div>總金額: ${order.totalAmount}</div>
                            </OrderDetails>
                            <OrderItems>
                                {order.items?.map(item => (
                                    <OrderItem key={item.id}>
                                        <span>{item.productName}</span>
                                        <span>數量: {item.quantity}</span>
                                        <span>單價: ${item.price}</span>
                                    </OrderItem>
                                ))}
                            </OrderItems>
                        </OrderCard>
                    ))}
                </OrderList>
            )}
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    padding: 20px;
`;

const OrderList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const OrderCard = styled.div`
    background-color: ${props => props.theme.colors.cardBackground};
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatusSelect = styled.select`
    padding: 5px;
    border-radius: 4px;
`;

const OrderDetails = styled.div`
    margin: 10px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`;

const OrderItems = styled.div`
    margin-top: 10px;
    border-top: 1px solid ${props => props.theme.colors.border};
    padding-top: 10px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
`;

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    margin: 20px;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
`;

const NoOrders = styled.div`
    text-align: center;
    padding: 20px;
    color: #666;
`;

export default AdminOrders; 