import React from 'react';
import { Button, Card, DatePicker, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { register as apiRegister } from '../api/auth';

const { Title, Text } = Typography;

function countDigits(value) {
  if (!value) return 0;
  let count = 0;
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (ch >= '0' && ch <= '9') count += 1;
  }
  return count;
}

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        phone: values.phone,
        birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : null,
      };

      await apiRegister(payload);
      message.success('Регистрация прошла успешно. Войдите в аккаунт.');
      navigate('/login');
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        const fields = Object.keys(data).map((name) => ({
          name,
          errors: Array.isArray(data[name]) ? data[name] : [String(data[name])],
        }));
        if (fields.length > 0) {
          form.setFields(fields);
        }
      }
      message.error('Не удалось выполнить регистрацию. Проверьте данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordMatch = ({ getFieldValue }) => ({
    validator(_, value) {
      const pwd = getFieldValue('password');
      if (!value || value === pwd) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Пароли не совпадают'));
    },
  });

  return (
    <div data-easytag="id1-src/pages/Register.jsx" style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
      <Card style={{ width: 520 }}>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 8 }}>Регистрация</Title>
          <Text type="secondary">Создайте аккаунт, чтобы продолжить</Text>
        </div>

        <Form
          data-easytag="id2-src/pages/Register.jsx"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input placeholder="example@mail.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[
              { required: true, message: 'Введите имя пользователя' },
              {
                validator(_, value) {
                  if (!value || (value && value.trim().length >= 3)) return Promise.resolve();
                  return Promise.reject(new Error('Минимум 3 символа'));
                },
              },
            ]}
          >
            <Input placeholder="username" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="ФИО"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input placeholder="Иванов Иван Иванович" autoComplete="name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Телефон"
            tooltip="Укажите номер в международном формате"
            rules={[
              { required: true, message: 'Введите номер телефона' },
              {
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  const digits = countDigits(value);
                  if (digits >= 10) return Promise.resolve();
                  return Promise.reject(new Error('Введите корректный номер телефона'));
                },
              },
            ]}
          >
            <Input placeholder="+7 999 123-45-67" autoComplete="tel" />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="Дата рождения"
            rules={[{ required: true, message: 'Выберите дату рождения' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="ГГГГ-ММ-ДД" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Введите пароль' },
              {
                validator(_, value) {
                  if (!value || value.length >= 8) return Promise.resolve();
                  return Promise.reject(new Error('Минимальная длина пароля 8 символов'));
                },
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Введите пароль" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Подтверждение пароля"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              validatePasswordMatch,
            ]}
          >
            <Input.Password placeholder="Повторите пароль" autoComplete="new-password" />
          </Form.Item>

          <Form.Item>
            <Button data-easytag="id3-src/pages/Register.jsx" type="primary" htmlType="submit" block loading={loading}>
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
