import React from 'react';
import { Typography } from 'antd';

function Home() {
  return (
    <div data-easytag="id1-src/pages/Home.jsx" style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>Главная</Typography.Title>
      <Typography.Paragraph>
        Добро пожаловать! Это главная страница приложения.
      </Typography.Paragraph>
    </div>
  );
}

export default Home;
