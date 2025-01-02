import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Orders.css';
import Navbar from '../Navbar';

const getStatusInChinese = (status) => {
    switch (status) {
        case 'PENDING':
            return '處理中';
        case 'SHIPPED':
            return '已出貨';
        case 'DELIVERED':
            return '已送達';
        case 'CANCELLED':
            return '已取消';
        default:
            return status;
    }
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders', {
                    withCredentials: true
                });
                if (response.data.status === 200) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('獲取訂單失敗:', error);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <>
            <div className="orders-container">
                <h2>我的訂單</h2>
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span>訂單編號: {order.id}</span>
                            <span>訂單狀態: {getStatusInChinese(order.status)}</span>
                            <span>訂單日期: {new Date(order.orderDate).toLocaleString()}</span>
                        </div>
                        <div className="order-items">
                            {order.items?.map(item => (
                                <div key={item.id} className="order-item">
                                    <span>{item.productName}</span>
                                    <span>數量: {item.quantity}</span>
                                    <span>單價: ${item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-footer">
                            <span>總金額: ${order.totalAmount}</span>
                            <span>收件人: {order.recipientName}</span>
                            <span>配送地址: {order.shippingAddress}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Orders; 