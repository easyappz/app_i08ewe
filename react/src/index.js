import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import 'antd/dist/reset.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={ru_RU}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
  try {
    window.handleRoutes(['/', '/login', '/register', '/profile']);
  } catch (e) {
    // no-op
  }
}

reportWebVitals();
