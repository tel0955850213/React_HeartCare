// 新增權限檢查工具
export const isAdmin = (user) => {
    return user?.role === 'ADMIN';
}; 