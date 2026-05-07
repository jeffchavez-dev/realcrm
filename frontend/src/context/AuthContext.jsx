import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('realcrm_user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('realcrm_token');
    if (token) {
      authApi.me()
        .then(u => { setUser(u); localStorage.setItem('realcrm_user', JSON.stringify(u)); })
        .catch(() => { localStorage.removeItem('realcrm_token'); localStorage.removeItem('realcrm_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('realcrm_token', data.token);
    localStorage.setItem('realcrm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem('realcrm_token');
    localStorage.removeItem('realcrm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin', isManager: ['admin','manager'].includes(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
