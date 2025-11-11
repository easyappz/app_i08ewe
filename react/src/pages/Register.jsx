import React from 'react';
import { Typography, Alert } from 'antd';

function Register() {
  return (
    <div data-easytag="id1-src/pages/Register.jsx" style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>Регистрация</Typography.Title>
      <Alert type="info" message="Страница регистрации" description="Форма регистрации будет реализована на следующем шаге." showIcon />
    </div>
  );
}

export default Register;
