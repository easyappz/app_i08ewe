import React from 'react';
import { Card, Descriptions, Spin, Alert } from 'antd';
import dayjs from 'dayjs';
import { getProfile } from '../api/auth';

function Profile() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const me = await getProfile();
        if (active) setData(me);
      } catch (e) {
        if (active) setError(e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = dayjs(dateStr);
    return d.isValid() ? d.format('DD.MM.YYYY') : '-';
  };

  return (
    <div data-easytag="id1-src/pages/Profile.jsx" style={{ padding: 24 }}>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <Spin />
        </div>
      )}

      {!loading && error && (
        <Alert
          data-easytag="id4-src/pages/Profile.jsx"
          type="error"
          message="Не удалось загрузить профиль"
          description={error?.response?.data?.detail || error?.message || 'Произошла ошибка'}
          showIcon
        />
      )}

      {!loading && !error && data && (
        <Card data-easytag="id2-src/pages/Profile.jsx" title="Профиль" style={{ maxWidth: 720, margin: '0 auto' }}>
          <Descriptions data-easytag="id3-src/pages/Profile.jsx" bordered column={1} size="middle">
            <Descriptions.Item label="Email">{data.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="Username">{data.username || '-'}</Descriptions.Item>
            <Descriptions.Item label="ФИО">{data.profile?.full_name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{data.profile?.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Дата рождения">{formatDate(data.profile?.birthday)}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default Profile;
