import instance from './axios';

// GET /api/auth/profile/ according to openapi.yml
export async function getProfile() {
  const response = await instance.get('/api/auth/profile/');
  return response.data;
}

// POST /api/auth/login/ according to openapi.yml
export async function login({ username, password }) {
  const res = await instance.post('/api/auth/login/', { username, password });
  return res.data;
}
