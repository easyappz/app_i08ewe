import React from 'react';
import instance from '../api/axios';

const AuthContext = React.createContext(null);

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';

function getToken(key) {
  try {
    return localStorage.getItem(key) || null;
  } catch (_) {
    return null;
  }
}

function setToken(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {}
}

function removeToken(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {}
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => !!getToken(ACCESS_KEY));

  React.useEffect(() => {
    const access = getToken(ACCESS_KEY);
    if (access) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setIsAuthenticated(true);
    } else {
      delete instance.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }, []);

  const login = React.useCallback((access, refresh) => {
    if (access) setToken(ACCESS_KEY, access);
    if (refresh) setToken(REFRESH_KEY, refresh);
    instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setIsAuthenticated(true);
    try { window.dispatchEvent(new Event('auth:login')); } catch (_) {}
  }, []);

  const logout = React.useCallback(() => {
    removeToken(ACCESS_KEY);
    removeToken(REFRESH_KEY);
    delete instance.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    try { window.dispatchEvent(new Event('auth:logout')); } catch (_) {}
  }, []);

  const value = React.useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
