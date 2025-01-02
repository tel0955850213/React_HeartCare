import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const authAPI = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                username: credentials.username,
                password: credentials.password
            });
            console.log('登入 API 響應:', response);
            return response;
        } catch (error) {
            console.error('登入 API 錯誤:', error);
            throw error;
        }
    },
    
    isLoggedIn: () => api.get('/auth/isLoggedIn'),
    
    logout: () => api.get('/auth/logout')
};

export const productAPI = {
    getAllProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`)
};