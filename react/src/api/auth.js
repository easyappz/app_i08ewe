import instance from './axios';

// GET /api/auth/profile/ according to openapi.yml
export async function getProfile() {
  const response = await instance.get('/api/auth/profile/');
  return response.data;
}
