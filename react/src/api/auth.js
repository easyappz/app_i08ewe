import instance from './axios';

export async function register(payload) {
  const response = await instance.post('/api/auth/register/', payload);
  return response.data;
}

export async function login(payload) {
  const response = await instance.post('/api/auth/login/', payload);
  return response.data;
}

export async function getProfile() {
  const response = await instance.get('/api/auth/profile/');
  return response.data;
}
