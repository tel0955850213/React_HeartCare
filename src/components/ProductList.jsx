import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                console.log('商品列表響應:', response.data);
                if (response.data.status === 200) {
                    setProducts(response.data.data);
                    console.log('設置後的商品列表:', response.data.data);
                }
            } catch (error) {
                console.error('獲取商品列表失敗:', error);
            }
        };
        fetchProducts();
    }, []);

    const getImageUrl = (product) => {
        if (!product.imageUrl) {
            return `/images/books/book${product.id}.jpg`;
        }
        if (product.imageUrl.startsWith('/uploads')) {
            return `http://localhost:8080${product.imageUrl}`;
        }
        if (product.imageUrl.startsWith('/images')) {
            return product.imageUrl;
        }
        return product.imageUrl;
    };

    return (
        <Container>
            <Title>商品列表</Title>
            {products.length === 0 && <div>暫無商品</div>}
            <ProductGrid>
                {products.map(product => (
                    <ProductCard key={product.id}>
                        <ProductImage 
                            src={getImageUrl(product)}
                            alt={product.name}
                            onError={(e) => {
                                console.log(`圖片載入失敗: ${e.target.src}`);
                                e.target.src = '/images/books/default.jpg';
                                e.target.onerror = null;
                            }}
                        />
                        <ProductInfo>
                            <ProductName>{product.name}</ProductName>
                            <ProductDescription>{product.description}</ProductDescription>
                            <ProductPrice>NT$ {product.price}</ProductPrice>
                            <AddToCartButton onClick={() => addToCart(product)}>
                                加入購物車
                            </AddToCartButton>
                        </ProductInfo>
                    </ProductCard>
                ))}
            </ProductGrid>
        </Container>
    );
};

// 樣式
const Container = styled.div`
    max-width: 1200px;
    margin: 80px auto 20px;
    padding: 0 20px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 30px;
    color: #333;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 一行個商品
    gap: 20px;
    
    @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr); // 平板上一行三個
    }
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr); // 手機上一行兩個
    }
`;

const ProductCard = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const ProductImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: contain;
    margin-bottom: 10px;
`;

const ProductInfo = styled.div`
    padding: 15px;
`;

const ProductName = styled.h3`
    margin: 0;
    font-size: 1rem;
    color: #333;
    margin-bottom: 10px;
`;

const ProductPrice = styled.div`
    color: #e53935;
    font-weight: bold;
    margin-bottom: 10px;
`;

const AddToCartButton = styled.button`
    width: 100%;
    padding: 8px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;

const ProductDescription = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default ProductList; 