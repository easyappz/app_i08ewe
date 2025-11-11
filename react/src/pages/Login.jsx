import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await apiLogin({ username: values.username, password: values.password });
      const access = data?.access || '';
      const refresh = data?.refresh || '';
      if (!access || !refresh) {
        throw new Error('Токены не получены');
      }
      login({ access, refresh });
      message.success('Вы успешно вошли');
      navigate('/profile');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (detail) {
        message.error(String(detail));
      } else {
        message.error('Не удалось выполнить вход. Проверьте данные и попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-easytag="id1-src/pages/Login.jsx" style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
      <Card style={{ width: 420 }}>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 8 }}>Вход</Title>
          <Text type="secondary">Введите учетные данные</Text>
        </div>

        <Form
          data-easytag="id2-src/pages/Login.jsx"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
          >
            <Input placeholder="username" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password placeholder="Введите пароль" autoComplete="current-password" />
          </Form.Item>

          <Form.Item>
            <Button data-easytag="id3-src/pages/Login.jsx" type="primary" htmlType="submit" block loading={loading}>
              Войти
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
