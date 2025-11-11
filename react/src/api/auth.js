import instance from './axios';

export async function loginApi({ username, password }) {
  const res = await instance.post('/api/auth/login/', { username, password });
  return res.data;
}

export async function refreshApi({ refresh }) {
  const res = await instance.post('/api/auth/refresh/', { refresh });
  return res.data;
}

export async function profileApi() {
  const res = await instance.get('/api/auth/profile/');
  return res.data;
}
