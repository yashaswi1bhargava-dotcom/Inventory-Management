import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { UserRole } from '../types';

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  name: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  register: (data: { name: string; email: string; password: string; confirm_password: string }) => Promise<UserRole>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<UserRole | null>(() => localStorage.getItem('role') as UserRole | null);
  const [name, setName] = useState<string | null>(() => localStorage.getItem('name'));

  const persistAuth = useCallback((accessToken: string, userRole: UserRole, userName: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('name', userName);
    setToken(accessToken);
    setRole(userRole);
    setName(userName);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    persistAuth(data.access_token, data.role, data.name);
    return data.role;
  }, [persistAuth]);

  const register = useCallback(async (formData: { name: string; email: string; password: string; confirm_password: string }) => {
    const { data } = await authApi.register(formData);
    persistAuth(data.access_token, data.role, data.name);
    return data.role;
  }, [persistAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setToken(null);
    setRole(null);
    setName(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        name,
        isAuthenticated: !!token,
        isAdmin: role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
