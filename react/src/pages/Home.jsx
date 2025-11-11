import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div data-easytag="id1-src/pages/Home.jsx" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card data-easytag="id2-src/pages/Home.jsx" style={{ maxWidth: 720, width: '100%' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>Добро пожаловать!</Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Это демо-сайт с регистрацией и авторизацией. После входа вы увидите страницу профиля с основной информацией.
          </Typography.Paragraph>

          <div data-easytag="id3-src/pages/Home.jsx" style={{ marginTop: 8 }}>
            {!isAuthenticated ? (
              <Space>
                <Button type="primary" onClick={() => navigate('/login')}>Войти</Button>
                <Button onClick={() => navigate('/register')}>Регистрация</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => navigate('/profile')}>Перейти в профиль</Button>
            )}
          </div>
        </Space>
      </Card>
    </div>
  );
}

export default Home;
