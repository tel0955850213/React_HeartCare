import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StatisticsPanel = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const StatItem = styled.div`
    flex: 1;
    text-align: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Label = styled.div`
    font-weight: bold;
`;

const Value = styled.div`
    margin-top: 5px;
`;

const OrderList = styled.div`
    margin-top: 20px;
`;

const OrderItem = styled.div`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const OrderInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const CancelRequest = styled.div`
    margin-top: 10px;
`;

const Button = styled.button`
    margin-top: 10px;
`;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [statistics, setStatistics] = useState({
        totalSales: 0,
        orderCount: 0,
        cancelRate: 0
    });
    
    useEffect(() => {
        fetchOrders();
        fetchStatistics();
    }, []);
    
    const handleApproveCancel = async (orderId) => {
        try {
            const response = await axios.post(
                `/api/orders/${orderId}/approve-cancel`,
                null,
                { withCredentials: true }
            );
            if (response.data.status === 200) {
                fetchOrders(); // 重新載入訂單列表
                fetchStatistics(); // 更新統計數據
            }
        } catch (error) {
            console.error('核准取消失敗:', error);
        }
    };
    
    return (
        <div>
            <StatisticsPanel>
                <StatItem>
                    <Label>總銷售額</Label>
                    <Value>NT$ {statistics.totalSales}</Value>
                </StatItem>
                <StatItem>
                    <Label>訂單數</Label>
                    <Value>{statistics.orderCount}</Value>
                </StatItem>
                <StatItem>
                    <Label>取消率</Label>
                    <Value>{statistics.cancelRate}%</Value>
                </StatItem>
            </StatisticsPanel>
            
            <OrderList>
                {orders.map(order => (
                    <OrderItem key={order.id}>
                        <OrderInfo>
                            <div>訂單編號: {order.id}</div>
                            <div>收件人: {order.recipientName}</div>
                            <div>狀態: {order.status}</div>
                            {order.status === 'CANCEL_REQUESTED' && (
                                <CancelRequest>
                                    <div>取消原因: {order.cancelReason}</div>
                                    <Button onClick={() => handleApproveCancel(order.id)}>
                                        核准取消
                                    </Button>
                                </CancelRequest>
                            )}
                        </OrderInfo>
                    </OrderItem>
                ))}
            </OrderList>
        </div>
    );
};

export default OrderManagement; 