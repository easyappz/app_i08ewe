import React from 'react';
import { Typography, Alert } from 'antd';

function Login() {
  return (
    <div data-easytag="id1-src/pages/Login.jsx" style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>Войти</Typography.Title>
      <Alert type="info" message="Страница авторизации" description="Интерфейс авторизации будет реализован на следующем шаге." showIcon />
    </div>
  );
}

export default Login;
