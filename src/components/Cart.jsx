import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart, addToCart } = useCart();
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        recipientName: '',
        recipientPhone: '',
        shippingAddress: ''
    });

    const [showShippingForm, setShowShippingForm] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        try {
            // 檢查是否登入
            if (!user) {
                alert('請先登入');
                navigate('/login');
                return;
            }

            // 檢查購物車是否為空
            if (cartItems.length === 0) {
                alert('購物車是空的');
                return;
            }

            // 顯示收件資訊表單
            setShowShippingForm(true);

        } catch (error) {
            console.error('結帳錯誤:', error);
            alert('結帳失敗: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        try {
            // 檢查收件資訊是否完整
            if (!shippingInfo.recipientName || !shippingInfo.recipientPhone || !shippingInfo.shippingAddress) {
                alert('請填寫完整的收件資訊');
                return;
            }

            console.log('準備結帳的商品:', cartItems);

            // 轉換購物車項目格式
            const orderItems = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            // 建立訂單
            const response = await axios.post(
                'http://localhost:8080/api/orders',
                orderItems,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === 200) {
                // 更新訂單的收件資訊
                const orderId = response.data.data.id;
                await axios.post(
                    `http://localhost:8080/api/orders/${orderId}/shipping-info`,
                    shippingInfo,
                    { withCredentials: true }
                );

                alert('訂單建立成功！');
                clearCart();  // 清空購物車
                navigate('/orders');  // 導向訂單頁面
            } else {
                alert(response.data.message || '結帳失敗');
            }
        } catch (error) {
            console.error('結帳失敗:', error);
            alert('結帳失敗：' + (error.response?.data?.message || '未知錯誤'));
        }
    };

    const handleAddToCart = async (product) => {
        try {
            if (!user) {
                alert('請先登入');
                navigate('/login');
                return;
            }
            
            addToCart(product);
            
        } catch (error) {
            console.error('添加到購物車失敗:', error);
            if (error.response?.status === 401) {
                alert('請重新登入');
                navigate('/login');
            }
        }
    };

    return (
        <CartContainer>
            {!showShippingForm ? (
                <>
                    <CartItems>
                        {cartItems.map(item => (
                            <CartItem key={item.id}>
                                <ItemImage 
                                    src={item.image} 
                                    alt={item.title}
                                    onError={(e) => {
                                        console.error(`圖片載入失敗:`, item.image);
                                        e.target.src = '/images/books/default.jpg';
                                    }}
                                />
                                <ItemInfo>
                                    <ItemTitle>{item.title}</ItemTitle>
                                    <ItemPrice>NT$ {item.price}</ItemPrice>
                                    <QuantityControl>
                                        <QuantityButton 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </QuantityButton>
                                        <QuantityDisplay>{item.quantity}</QuantityDisplay>
                                        <QuantityButton 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </QuantityButton>
                                    </QuantityControl>
                                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                                        移除
                                    </RemoveButton>
                                </ItemInfo>
                            </CartItem>
                        ))}
                    </CartItems>
                    <CheckoutButton onClick={handleCheckout}>
                        前往結帳 (總計: NT$ {total})
                    </CheckoutButton>
                </>
            ) : (
                <ShippingForm onSubmit={handleShippingSubmit}>
                    <h2>收件資訊</h2>
                    <FormGroup>
                        <label>收件人姓名:</label>
                        <input
                            type="text"
                            required
                            value={shippingInfo.recipientName}
                            onChange={e => setShippingInfo({
                                ...shippingInfo,
                                recipientName: e.target.value
                            })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>聯絡電話:</label>
                        <input
                            type="tel"
                            required
                            value={shippingInfo.recipientPhone}
                            onChange={e => setShippingInfo({
                                ...shippingInfo,
                                recipientPhone: e.target.value
                            })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>收件地址:</label>
                        <input
                            type="text"
                            required
                            value={shippingInfo.shippingAddress}
                            onChange={e => setShippingInfo({
                                ...shippingInfo,
                                shippingAddress: e.target.value
                            })}
                        />
                    </FormGroup>
                    <ButtonGroup>
                        <button type="submit">確認送出</button>
                        <button type="button" onClick={() => setShowShippingForm(false)}>
                            返回購物車
                        </button>
                    </ButtonGroup>
                </ShippingForm>
            )}
        </CartContainer>
    );
};

const CartContainer = styled.div`
    max-width: 1200px;
    margin: 100px auto;
    padding: 0 20px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
`;

const EmptyCart = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2rem;
    color: #666;
`;

const CartItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const CartItem = styled.div`
    display: flex;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ItemImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
`;

const ItemInfo = styled.div`
    flex: 1;
    margin-left: 20px;
`;

const ItemTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const ItemPrice = styled.div`
    color: #e53935;
    font-weight: bold;
    margin-bottom: 10px;
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const QuantityButton = styled.button`
    padding: 5px 10px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const QuantityDisplay = styled.span`
    min-width: 30px;
    text-align: center;
`;

const RemoveButton = styled.button`
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    background: #ff4444;
    color: white;
    border-radius: 4px;
    cursor: pointer;
`;

const TotalSection = styled.div`
    margin-top: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TotalText = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
`;

const CheckoutButton = styled.button`
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
        background: #45a049;
    }
`;

const ShippingForm = styled.form`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: ${props => props.theme.colors.cardBackground};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
    
    label {
        display: block;
        margin-bottom: 5px;
    }
    
    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
    
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &[type="submit"] {
            background-color: #4CAF50;
            color: white;
        }
        
        &[type="button"] {
            background-color: #f44336;
            color: white;
        }
    }
`;

export default Cart; 