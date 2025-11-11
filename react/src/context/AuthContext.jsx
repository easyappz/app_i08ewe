import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginApi, profileApi } from '../api/auth';

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';

export const AuthContext = createContext({
  access: null,
  refresh: null,
  user: null,
  login: async () => {},
  logout: () => {},
  loadProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);

  const persistTokens = useCallback((a, r) => {
    if (a) localStorage.setItem(ACCESS_KEY, a);
    if (r) localStorage.setItem(REFRESH_KEY, r);
    setAccess(a || null);
    setRefresh(r || null);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem('user');
    } catch (_) {}
    setAccess(null);
    setRefresh(null);
    setUser(null);
    try {
      window.location.assign('/login');
    } catch (_) {}
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const me = await profileApi();
      setUser(me || null);
      try {
        localStorage.setItem('user', JSON.stringify(me || null));
      } catch (_) {}
      return me;
    } catch (e) {
      // If unauthorized, ensure clean state
      if (e?.response?.status === 401) {
        logout();
      }
      throw e;
    }
  }, [logout]);

  const login = useCallback(async ({ username, password }) => {
    const data = await loginApi({ username, password });
    const a = data?.access || null;
    const r = data?.refresh || null;
    persistTokens(a, r);
    await loadProfile();
    return data;
  }, [loadProfile, persistTokens]);

  // Load tokens and cached user at init
  useEffect(() => {
    const a = localStorage.getItem(ACCESS_KEY);
    const r = localStorage.getItem(REFRESH_KEY);
    let cachedUser = null;
    try {
      cachedUser = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (_) {
      cachedUser = null;
    }
    if (a) setAccess(a);
    if (r) setRefresh(r);
    if (cachedUser) setUser(cachedUser);
    // Optionally try to refresh user profile if we have token
    if (a) {
      loadProfile().catch(() => {});
    }
  }, [loadProfile]);

  // React to global logout events from axios
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  const value = useMemo(() => ({ access, refresh, user, login, logout, loadProfile }), [access, refresh, user, login, logout, loadProfile]);

  return (
    <AuthContext.Provider value={value}>
      <div data-easytag="id1-src/context/AuthContext.jsx">{children}</div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
