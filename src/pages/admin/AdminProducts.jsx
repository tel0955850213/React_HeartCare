import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ProductsContainer = styled.div`
  padding: 20px;
`;

const ProductTable = styled.table`
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

const ImageUploadContainer = styled.div`
  margin-bottom: 16px;
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-top: 8px;
`;

const ProductForm = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 90%;
  max-width: 500px;
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-height: 100px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  background: white;
  padding: 10px 0;
`;

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      console.error('獲取商品列表失敗:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此商品？')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchProducts();
      } catch (error) {
        console.error('刪除商品失敗:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const imageFile = formData.get('image');
      let imageUrl = editingProduct?.imageUrl;
      
      if (imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        const imageResponse = await axios.post(
          'http://localhost:8080/api/admin/upload',
          imageFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        imageUrl = imageResponse.data.data;
      }

      const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        description: formData.get('description'),
        imageUrl: imageUrl
      };

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
      setImagePreview(null);
    } catch (error) {
      console.error('操作失敗:', error);
      alert('操作失敗: ' + error.response?.data?.message || '未知錯誤');
    }
  };

  return (
    <ProductsContainer>
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
      
      <ProductTable>
        <thead>
          <tr>
            <th>商品名稱</th>
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
                <Button className="secondary" onClick={() => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}>編輯</Button>
                <Button className="danger" onClick={() => handleDelete(product.id)}>刪除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      {showForm && (
        <>
          <Overlay onClick={() => setShowForm(false)} />
          <ProductForm onSubmit={handleSubmit}>
            <h3>{editingProduct ? '編輯商品' : '新增商品'}</h3>
            
            <ImageUploadContainer>
              <FormGroup>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {(imagePreview || editingProduct?.imageUrl) && (
                  <ImagePreview 
                    src={imagePreview || editingProduct?.imageUrl} 
                    alt="預覽圖"
                  />
                )}
              </FormGroup>
            </ImageUploadContainer>

            <FormGroup>
              <Input
                name="name"
                placeholder="商品名稱"
                defaultValue={editingProduct?.name}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                name="price"
                type="number"
                placeholder="價格"
                defaultValue={editingProduct?.price}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                name="stock"
                type="number"
                placeholder="庫存"
                defaultValue={editingProduct?.stock}
                required
              />
            </FormGroup>
            <FormGroup>
              <TextArea
                name="description"
                placeholder="商品描述"
                defaultValue={editingProduct?.description}
              />
            </FormGroup>
            
            <ButtonGroup>
              <Button type="submit" className="primary">
                {editingProduct ? '更新' : '新增'}
              </Button>
              <Button 
                type="button" 
                className="secondary"
                onClick={() => {
                  setShowForm(false);
                  setImagePreview(null);
                }}
              >
                取消
              </Button>
            </ButtonGroup>
          </ProductForm>
        </>
      )}
    </ProductsContainer>
  );
};

export default AdminProducts; 