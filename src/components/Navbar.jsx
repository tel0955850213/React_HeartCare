import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const isLoggedIn = true; // 這裡應該從狀態管理中獲取

    return (
        <nav>
            {/* 其他導航項... */}
            {isLoggedIn && (
                <Link to="/orders">我的訂單</Link>
            )}
        </nav>
    );
};

export default Navbar; 