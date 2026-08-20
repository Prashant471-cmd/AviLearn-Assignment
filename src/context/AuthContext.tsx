/**
 * AviLearn — Authentication Context
 * File: src/context/AuthContext.tsx
 * Description: Global authentication state management using React Context.
 *              Provides role-based access (guest | member | admin) across all pages.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SessionUser,
  getCurrentUser,
  apiLogin,
  apiLogout,
  apiRegister,
  RegisterPayload,
  seedDatabase,
} from '../lib/mockApi';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'guest' | 'member' | 'admin';

export interface AuthContextValue {
  currentUser: SessionUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize DB seed and restore session on mount
  useEffect(() => {
    seedDatabase();
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const role: UserRole = currentUser
    ? (currentUser.role === 'admin' ? 'admin' : 'member')
    : 'guest';

  const refreshUser = useCallback(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      if (result.success && result.data) {
        setCurrentUser(result.data.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setCurrentUser(null);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const result = await apiRegister(payload);
      if (result.success && result.data) {
        setCurrentUser(result.data.user);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    currentUser,
    role,
    isAuthenticated: !!currentUser,
    isAdmin: role === 'admin',
    loading,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
