import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 添加請求攔截器
api.interceptors.request.use(
    config => {
        // 確保每個請求都帶上 credentials
        config.withCredentials = true;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加響應攔截器
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 重定向到登入頁面
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 