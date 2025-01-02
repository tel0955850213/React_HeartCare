import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AdminContainer,
  AdminHeader,
  AdminTable,
  Button,
  Form,
  Input,
  TextArea
} from '../../styles/AdminStyles';
import AdminLayout from '../../layouts/AdminLayout';

const ProductManagement = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      alert('獲取商品列表失敗');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      description: formData.get('description')
    };

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:8080/api/admin/products/${editingProduct.id}`, 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          'http://localhost:8080/api/admin/products', 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      alert('操作失敗');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除嗎？')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchProducts();
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
        alert('刪除失敗');
      }
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <h2>商品管理</h2>
        <Button 
          className="primary"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          新增商品
        </Button>
      </AdminHeader>

      <AdminTable>
        <thead>
          <tr>
            <th>名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowForm(true);
                  }}
                >
                  編輯
                </Button>
                <Button
                  className="danger"
                  onClick={() => handleDelete(product.id)}
                >
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <h3>{editingProduct ? '編輯商品' : '新增商品'}</h3>
          <Input
            name="name"
            placeholder="商品名稱"
            defaultValue={editingProduct?.name}
            required
          />
          <Input
            name="price"
            type="number"
            placeholder="價格"
            defaultValue={editingProduct?.price}
            required
          />
          <Input
            name="stock"
            type="number"
            placeholder="庫存"
            defaultValue={editingProduct?.stock}
            required
          />
          <TextArea
            name="description"
            placeholder="商品描述"
            defaultValue={editingProduct?.description}
          />
          <Button type="submit" className="primary">
            {editingProduct ? '更新' : '新增'}
          </Button>
          <Button type="button" onClick={() => setShowForm(false)}>
            取消
          </Button>
        </Form>
      )}
    </AdminContainer>
  );
};

const WrappedProductManagement = () => (
  <AdminLayout>
    <ProductManagement />
  </AdminLayout>
);

export default WrappedProductManagement; 