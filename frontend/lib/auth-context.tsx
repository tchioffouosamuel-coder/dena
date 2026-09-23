'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, setToken, clearToken, getToken } from './api';

type AuthUser = { id: string; email: string; role: 'ADMIN' | 'STAFF' } | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Fournit l'utilisateur connecté à tout l'espace admin. Le token JWT est
// stocké côté client (localStorage) : simple à mettre en place pour un
// panneau d'administration ; pour une sécurité renforcée en production,
// on peut faire transiter le token via un cookie httpOnly posé par une
// route Next.js qui relaie l'appel au backend.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('dena_user');
    if (getToken() && raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await apiLogin(email, password);
    setToken(res.accessToken);
    localStorage.setItem('dena_user', JSON.stringify(res.user));
    setUser(res.user as AuthUser);
  }

  function logout() {
    clearToken();
    localStorage.removeItem('dena_user');
    setUser(null);
    router.push('/admin/login');
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
