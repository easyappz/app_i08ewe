import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';
const USER_KEY = 'user';

function readStoredAuth() {
  const access = localStorage.getItem(ACCESS_KEY);
  const refresh = localStorage.getItem(REFRESH_KEY);
  let user = null;
  const userRaw = localStorage.getItem(USER_KEY);
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (_) {
      user = null;
    }
  }
  return { access, refresh, user };
}

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [{ access, refresh, user }, setAuth] = useState(() => readStoredAuth());

  const isAuthenticated = Boolean(access);

  const setUser = useCallback((nextUser) => {
    try {
      if (nextUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (_) {}
    setAuth((prev) => ({ ...prev, user: nextUser }));
  }, []);

  const login = useCallback(({ access: nextAccess, refresh: nextRefresh, user: nextUser }) => {
    if (nextAccess) localStorage.setItem(ACCESS_KEY, nextAccess);
    if (nextRefresh) localStorage.setItem(REFRESH_KEY, nextRefresh);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setAuth({ access: nextAccess || null, refresh: nextRefresh || null, user: nextUser || null });
    try {
      window.dispatchEvent(new Event('auth:login'));
    } catch (_) {}
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (_) {}
    setAuth({ access: null, refresh: null, user: null });
    try {
      window.dispatchEvent(new Event('auth:logout'));
    } catch (_) {}
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setAuth(readStoredAuth());
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:logout', onStorage);
    window.addEventListener('auth:login', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:logout', onStorage);
      window.removeEventListener('auth:login', onStorage);
    };
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    setUser,
  }), [isAuthenticated, user, login, logout, setUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
