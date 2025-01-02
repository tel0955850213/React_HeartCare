import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// antd 5.x 不需要顯式引入 CSS
// import 'antd/dist/reset.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
