import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders', {
                withCredentials: true
            });
            console.log("訂單響應數據:", response.data);
            if (response.data && response.data.data) {
                setOrders(response.data.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('獲取訂單失敗:', error);
            setOrders([]);
        }
    };

    return (
        <Container>
            <Title>我的訂單</Title>
            {!orders || orders.length === 0 ? (
                <EmptyMessage>目前沒有訂單</EmptyMessage>
            ) : (
                <OrderList>
                    {orders.map((order) => (
                        <OrderCard key={order.id}>
                            <OrderHeader>
                                <OrderId>訂單編號: {order.id}</OrderId>
                                <OrderDate>訂單日期: {new Date(order.orderDate).toLocaleDateString()}</OrderDate>
                                <OrderStatus>狀態: {order.status}</OrderStatus>
                            </OrderHeader>
                            <ItemList>
                                {order.orderItems && order.orderItems.map((item) => (
                                    <OrderItem key={item.id}>
                                        <ProductImage 
                                            src={item.product?.images?.[0]?.imageBase64 || '/default-image.jpg'} 
                                            alt={item.product?.name} 
                                        />
                                        <ItemInfo>
                                            <ProductName>{item.product?.name}</ProductName>
                                            <ItemQuantity>數量: {item.quantity}</ItemQuantity>
                                            <ItemPrice>價格: NT$ {item.price}</ItemPrice>
                                        </ItemInfo>
                                    </OrderItem>
                                ))}
                            </ItemList>
                            <OrderTotal>
                                總計: NT$ {order.totalAmount}
                            </OrderTotal>
                        </OrderCard>
                    ))}
                </OrderList>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    margin: 100px auto 20px;
    padding: 20px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
`;

const EmptyMessage = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #666;
`;

const OrderList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const OrderCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const OrderHeader = styled.div`
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
`;

const OrderId = styled.div`
    font-weight: bold;
    color: #333;
`;

const OrderDate = styled.div`
    color: #666;
`;

const OrderStatus = styled.div`
    color: #666;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const OrderItem = styled.div`
    display: flex;
    gap: 15px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 4px;
`;

const ProductImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
`;

const ItemInfo = styled.div`
    flex: 1;
`;

const ProductName = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`;

const ItemQuantity = styled.div`
    color: #666;
`;

const ItemPrice = styled.div`
    color: #e53935;
    font-weight: bold;
`;

const OrderTotal = styled.div`
    text-align: right;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-weight: bold;
    font-size: 1.2em;
`;

export default UserOrders; 