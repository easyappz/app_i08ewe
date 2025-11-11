import React from 'react';
import { Typography } from 'antd';

function Profile() {
  return (
    <div data-easytag="id1-src/pages/Profile.jsx" style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginTop: 0 }}>Профиль</Typography.Title>
      <Typography.Paragraph>
        Здесь будет отображаться общая информация о пользователе после авторизации.
      </Typography.Paragraph>
    </div>
  );
}

export default Profile;
