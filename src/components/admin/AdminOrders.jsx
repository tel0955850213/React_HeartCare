import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('開始獲取訂單...');
                const response = await axios.get('http://localhost:8080/api/admin/orders', {
                    withCredentials: true
                });
                
                if (response.data.status === 200) {
                    console.log('原始訂單數據:', response.data.data);
                    
                    // 過濾掉已取消的訂單
                    const activeOrders = response.data.data.filter(order => {
                        console.log(`訂單 ${order.id} 狀態:`, order.status);
                        return order.status !== 'CANCELLED';
                    });
                    
                    console.log('過濾後的訂單:', activeOrders);
                    setOrders(activeOrders);
                }
            } catch (error) {
                console.error('獲取訂單失敗:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('確定要刪除這個訂單嗎？')) {
            return;
        }
        
        try {
            const response = await axios.delete(
                `http://localhost:8080/api/admin/orders/${orderId}`,
                { withCredentials: true }
            );
            
            if (response.data.status === 200) {
                alert('訂單刪除成功');
                // 重新載入訂單列表
                fetchOrders();
            } else {
                alert(response.data.message || '刪除失敗');
            }
        } catch (error) {
            console.error('刪除訂單錯誤:', error);
            alert('刪除訂單失敗: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <Container>
            <Title>訂單管理</Title>
            <OrderList>
                {orders.map(order => (
                    <OrderCard key={order.id}>
                        <OrderHeader>
                            <OrderId>訂單編號: {order.id}</OrderId>
                            <OrderDate>訂單日期: {new Date(order.orderDate).toLocaleString()}</OrderDate>
                            <OrderStatus>
                                狀態: {order.status === 'PENDING' ? '待處理' : 
                                      order.status === 'PROCESSING' ? '處理中' : 
                                      order.status === 'SHIPPED' ? '已出貨' : 
                                      order.status === 'DELIVERED' ? '已送達' : 
                                      order.status}
                            </OrderStatus>
                        </OrderHeader>
                        <OrderItems>
                            {order.items.map(item => (
                                <OrderItem key={item.id}>
                                    <ProductName>{item.product.name}</ProductName>
                                    <ItemQuantity>數量: {item.quantity}</ItemQuantity>
                                    <ItemPrice>單價: NT$ {item.price}</ItemPrice>
                                </OrderItem>
                            ))}
                        </OrderItems>
                        <OrderTotal>總計: NT$ {order.totalAmount}</OrderTotal>
                        {order.status?.includes('CANCEL') && (
                            <DeleteButton onClick={() => handleDeleteOrder(order.id)}>
                                刪除訂單
                            </DeleteButton>
                        )}
                    </OrderCard>
                ))}
            </OrderList>
        </Container>
    );
};

const Container = styled.div`
    padding: 80px 20px 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
`;

const OrderList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const OrderCard = styled.div`
    width: 48%;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const OrderId = styled.span`
    font-weight: bold;
`;

const OrderDate = styled.span`
    color: #666;
`;

const OrderStatus = styled.span`
    color: #666;
`;

const OrderItems = styled.div`
    margin-bottom: 10px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

const ProductName = styled.span`
    font-weight: bold;
`;

const ItemQuantity = styled.span`
    color: #666;
`;

const ItemPrice = styled.span`
    color: #666;
`;

const OrderTotal = styled.div`
    font-weight: bold;
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background-color: #ff4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1;

    &:hover {
        background-color: #cc0000;
    }
`;

export default AdminOrders; 