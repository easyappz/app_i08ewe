import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import ErrorBoundary from './ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const selectedKey = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/profile')) return '/profile';
    if (path.startsWith('/login')) return '/login';
    if (path.startsWith('/register')) return '/register';
    return '/';
  }, [location.pathname]);

  const items = React.useMemo(() => {
    const base = [
      { key: '/', label: <Link to="/">Главная</Link> },
    ];

    if (isAuthenticated) {
      base.push({ key: '/profile', label: <Link to="/profile">Профиль</Link> });
      base.push({ key: 'logout', label: 'Выйти' });
    } else {
      base.push({ key: '/login', label: <Link to="/login">Войти</Link> });
      base.push({ key: '/register', label: <Link to="/register">Регистрация</Link> });
    }

    return base;
  }, [isAuthenticated]);

  const onMenuClick = (info) => {
    if (info?.key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header data-easytag="id1-src/App.js" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div data-easytag="id5-src/App.js" style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>
            <Link to="/" style={{ color: '#fff' }}>Easyappz</Link>
          </div>
          <Menu
            data-easytag="id2-src/App.js"
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={onMenuClick}
            items={items}
            style={{ flex: 1 }}
          />
        </Layout.Header>
        <Layout.Content data-easytag="id3-src/App.js" style={{ background: '#fff' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={(
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Layout.Content>
        <Layout.Footer data-easytag="id4-src/App.js" style={{ textAlign: 'center' }}>
          <Typography.Text type="secondary">© {new Date().getFullYear()} Easyappz</Typography.Text>
        </Layout.Footer>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
